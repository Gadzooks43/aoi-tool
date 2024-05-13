import React, { useState, useEffect } from 'react';
import Map from '../Map';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';
import MediaQuery from 'react-responsive';

function Main() {
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [mapCoordinateView, setMapCoordinateView] = useState(null);
  const [importSoftReload, setImportSoftReload] = useState(null);
  const [reset, setReset] = useState(false);
  const [mode, setMode] = useState('Map Mode');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [clickedPoints, setClickedPoints] = useState([]);
  const [threshold, setThreshold] = useState(50); // Initial threshold value

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (mode !== "Image Mode") return;
      switch (event.key) {
        case 'ArrowLeft':
          setCurrentImageIndex(prevIndex => Math.max(0, prevIndex - 1));
          break;
        case 'ArrowRight':
          setCurrentImageIndex(prevIndex => Math.min(images.length - 1, prevIndex + 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, images]);

  const handlePrevButtonClick = () => {
    setCurrentImageIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const handleNextButtonClick = () => {
    setCurrentImageIndex(prevIndex => Math.min(images.length - 1, prevIndex + 1));
  };

  const handleMarkerUpdate = (newMarker) => {
    if (newMarker === null) {
      setMarkers([]);
      return;
    }
    setMarkers(currentMarkers => [...currentMarkers, newMarker]);
  };

  const handlePolygonClosed = (newPolygon) => {
    console.log('New Polygon: ', newPolygon);
    if (newPolygon === null) {
      setPolygons([]);
      return;
    }
    setPolygons(currentPolygons => [...currentPolygons, newPolygon]);
  }

  const handleFileChange = (event) => {
    const files = event.target.files;
    const imagesArray = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagesArray.push(e.target.result);
          if (i === 0) {
            // Set the first image as the initial canvas image
            setCurrentImageIndex(0);
          }
          setImages(imagesArray);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageClick = (event) => {
    const image = event.target;
    const rect = image.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY - rect.top;
    const thresholdValue = Math.random() * (1 - threshold/100) + threshold/100;
    // if x and y are outisde the image, return
    // get the width and height of the image
    const width = image.width;
    const height = image.height;
    // get the top left corner of the image
    const topLeftX = rect.left;
    const topLeftY = rect.top;
    // get the bottom right corner of the image
    const bottomRightX = topLeftX + width;
    const bottomRightY = topLeftY + height;
    // if x and y are outisde the image, return

    if (x < topLeftX || x > bottomRightX || y < topLeftY || y > bottomRightY) {
      return;
    }
    // Store the clicked point
    setClickedPoints([...clickedPoints, { x, y, threshold: thresholdValue }]);
  };

  const handleThresholdChange = (event) => {
    setThreshold(parseInt(event.target.value));
  };

  return (
    <div className="App">
      <MediaQuery minDeviceWidth={1224}>
        <Header className="App-header" setMapCoordinateView={setMapCoordinateView} setMode={setMode}/>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={1224}>
       <Sidebar className="sidebar" polygons={polygons} setMapCoordinateView={setMapCoordinateView} setImportSoftReload={setImportSoftReload} setReset={setReset} mode={mode} setClickedPoints={setClickedPoints} clickedPoints={clickedPoints}/>
      </MediaQuery>
      <div className="content" style={{ display: "flex"}}>
        <div className="column" style={{width:"100%", height:"100%"}}>
          {mode === "Map Mode" ? 
            <Map className="map" polygons={importSoftReload} handleMarkerUpdate={handleMarkerUpdate} handlePolygonClosed={handlePolygonClosed} mapCoordinateView={mapCoordinateView} reset={reset}/> 
            : 
            <div className="blank-canvas" onClick={handleImageClick} style={{ position: "relative", height: "80vh", width: "80vw", backgroundColor: "grey", borderRadius: "5px", padding: "10px"}}>
              <input type="file" onChange={handleFileChange} multiple directory="" webkitdirectory="" />
              {images.length > 0 && (
                <img src={images[currentImageIndex]} alt="Canvas" style={{height: "70vh", width: "80vw", objectFit: "contain"}}/>
              )}
              {clickedPoints.map((point, index) => (
                point.threshold > threshold/100 && (
                  <div key={index} style={{ position: "absolute", left: point.x, top: point.y, width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "red" }}></div>
                )
              ))}
              <div>
                <label htmlFor="thresholdSlider">Threshold:</label>
                <input
                  type="range"
                  id="thresholdSlider"
                  min="0"
                  max="100"
                  value={threshold}
                  onChange={handleThresholdChange}
                />
                <span>{threshold}</span>
              </div>
              <div>
                <button onClick={handlePrevButtonClick}>Previous</button>
                <button onClick={handleNextButtonClick}>Next</button>
              </div>
            </div>
          }
        </div>
        <MediaQuery minDeviceWidth={1224}>
          <div className="sidebar-column">
            <Sidebar className="sidebar" polygons={polygons} setMapCoordinateView={setMapCoordinateView} setImportSoftReload={setImportSoftReload} setReset={setReset} mode={mode} setClickedPoints={setClickedPoints} clickedPoints={clickedPoints}/>
          </div>
        </MediaQuery>
      </div>
    </div>
  );
};
export default Main;
