import React, { useEffect, useState, useRef } from 'react';
import Map from './Map';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';
import MediaQuery from 'react-responsive';

function App() {
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [mapCoordinateView, setMapCoordinateView] = useState(null);
  const [importSoftReload, setImportSoftReload] = useState(null);

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

  return (
    <div className="App">
      <MediaQuery minDeviceWidth={1224}>
        <Header className="App-header" setMapCoordinateView={setMapCoordinateView}/>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={1224}>
       <Sidebar className="sidebar" polygons={polygons} setMapCoordinateView={setMapCoordinateView} setImportSoftReload={setImportSoftReload}/>
      </MediaQuery>
      <div className="content" style={{ display: "flex"}}>
        <div className="column" style={{width:"100%", height:"100%"}}>
          <Map className="map" polygons={importSoftReload} handleMarkerUpdate={handleMarkerUpdate} handlePolygonClosed={handlePolygonClosed} mapCoordinateView={mapCoordinateView}/>
        </div>
        <MediaQuery minDeviceWidth={1224}>
          <div className="sidebar-column">
            <Sidebar className="sidebar" polygons={polygons} setMapCoordinateView={setMapCoordinateView} setImportSoftReload={setImportSoftReload}/>
          </div>
        </MediaQuery>
      </div>
    </div>
  );
};
export default App;