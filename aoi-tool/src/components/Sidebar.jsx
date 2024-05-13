import React, { useEffect, useState } from 'react';
import reset from '../reset.png';
import MediaQuery from 'react-responsive';
import boveyeLogo from "../boveye_logo.png";

const buttonBoxStyle = {display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "5px 5px 15px 5px"};
const logoStyle = {maxHeight: "100px", maxWidth: "100px", margin:'auto'};
const dataButtonStyle = {margin: 'auto', display: 'block', padding: '10px 10px', marginLeft: '10px', textTransform: 'uppercase', cursor: 'pointer'};
const undoButtonStyle = {margin: 'auto', display: 'block', padding: '10px 10px', marginLeft: '5px', cursor: 'pointer'};
const undoIMGStyle = {maxHeight: '15px', maxWidth: '15px'};
const GEOJSONStyle = {marginLeft: '10px', width: '250px', height: '100px', resize: 'none'};
const textOutputStyle = {backgroundColor: 'grey', border: '1px solid lightgrey', padding: '5px 5px', margin: '10px 10px'};

function convertGeoJSON(inputGeoJSON) {
  // Clone the input to avoid mutating the original data
  const outputGeoJSON = JSON.parse(JSON.stringify(inputGeoJSON));

  // Iterate over each feature in the FeatureCollection
  outputGeoJSON.features = inputGeoJSON.features.map(feature => {
    // For each feature, convert its geometry
    const geometry = feature.geometry;
    const newCoordinates = geometry.coordinates.map(polygon => {
      // Convert each coordinate in the polygon from {lng, lat} to [lng, lat]
      return polygon.map(coord => [coord.lng, coord.lat]);
    });
    // Update the coordinates of the geometry
    return {
      ...feature,
      geometry: {
        ...geometry,
        coordinates: newCoordinates
      }
    };
  });

  return outputGeoJSON;
}

const parseGeoJsonstoCollection = (geojsons) => {
  const collection = {
    type: 'FeatureCollection',
    features: [...geojsons]
  };

  return collection;
}

const getGeojsonString = (geojson) => {
  if (!geojson.features || geojson.features.length === 0) return '';
  const coordinates = geojson.features.map(feature => feature.geometry.coordinates);
  const geojsonString = JSON.stringify(coordinates);
  var string = geojsonString.replace(/[^0-9.,-]/g, '');
  string = string.replace(/,/g, ', ');
  return string;

}

const determineIfStringIsGeojson = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
};

const getCoordinatesFromString = (string, setIsImported) => {
  if (string === '') {
    setIsImported(false);
    return null
  };
  if (determineIfStringIsGeojson(string)) {
    var polygons = JSON.parse(string);
    return polygons;
  }
  string = string.replace(/\n/g, ', ');
  const coordinates = string.split(',');
  console.log("coordinates", coordinates);
  if (coordinates.length % 2 !== 0) {
    alert('Invalid coordinates');
    return null;
  }

  const pairs = [];
  for (let i = 0; i < coordinates.length; i += 2) {
    pairs.push([parseFloat(coordinates[i + 1]), parseFloat(coordinates[i])]);
  }
  for (let i = 0; i < pairs.length; i++) {
    if (isNaN(pairs[i][0]) || isNaN(pairs[i][1])) {
      alert('Invalid coordinates');
      return null;
    }
  }
  const convertToGeojsonPolygon = (coordinates) => {
    const polygon = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }};
    return polygon;
  };
  const polygon = convertToGeojsonPolygon(pairs);
  return [polygon];
};

const Sidebar = ({ polygons, setMapCoordinateView, setImportSoftReload, setReset, mode, setClickedPoints, clickedPoints }) => {
  const [geojson, setGeojson] = useState({});
  const [geojsonString, setGeojsonString] = useState('');
  const [isImported, setIsImported] = useState(false);

  useEffect(() => {
    setGeojson(parseGeoJsonstoCollection(polygons));
  }, [polygons]);

  useEffect(() => {
    setGeojsonString(JSON.stringify(getGeojsonString(geojson)));
  }, [geojson]);

  const handleImport = (string) => {
    if (!isImported) {
      setIsImported(true);
      return;
    }
    const polygons = getCoordinatesFromString(string, setIsImported);
    if (polygons === null) return;
    console.log("coordinates", polygons);
    const firstCoordinates = polygons[0].geometry.coordinates[0][0];
    setMapCoordinateView(firstCoordinates);
    // setImportSoftReload(polygons);
    setIsImported(false);
  };

  const handleExport = (e) => {
    const option = prompt('Select export format: \n1. Geojson\n2. Shapefile');
    const downloadGeojsonFile = () => {
      const filename = 'data.geojson';      
      // Add description to geojson
      const description = prompt('Enter description for the file:');
      const geojsonWithDescription = {
        ...geojson,
        description: description,
      };

      const data = JSON.stringify(geojsonWithDescription);

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    };
    if (option === '1' || option === "Geojson") {
      downloadGeojsonFile();
    } else if (option === '2' || option === "Shapefile") {
      handleSHPDownload();
    } else {
      alert('Invalid option');
      handleExport();
    }
  };

  const handleSHPDownload = async () => {
    const downloadGeojsonFile = () => {
      const filename = 'data.zip';      
      // Add description to geojson
      const description = prompt('Enter description for the file:');
      const geojsonWithDescription = {
        ...geojson,
        description: description,
      };

      const data = JSON.stringify(geojsonWithDescription);

      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    };
    downloadGeojsonFile();
};

  const handleUndo = (e) => {
    // Clear the map
    if (mode === "Annotated Mode") {
      setClickedPoints([]);
      return;
    }
    setReset(true);
    console.log('Undo');
    setGeojsonString('');
    setGeojson({});
  };

  const handleSave = (e) => {
    // Save the annotations as a geojson file using the clicked points
    console.log('Save');
    const filename = 'data.json';
    const data = JSON.stringify(clickedPoints);
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  };

  return (
    <div>
      <div style={buttonBoxStyle}>
        <MediaQuery maxDeviceWidth={1224}>
          <img className="logo" src={boveyeLogo} alt='Logo' style={logoStyle}/>
        </MediaQuery>
        { mode === 'Map Mode' ?
          <div>
            <button title="Import GEOJSON" className='data_button' style={dataButtonStyle} onClick={() => handleImport( isImported ? document.querySelector('textarea').value : '')}>Import</button>
            <button title="Export GEOJSON" className='data_button' style={dataButtonStyle} onClick={handleExport}>Export</button>
          </div>
         : <div>
            <button title="Save Annotations" className='data_button' style={dataButtonStyle} onClick={handleSave}>Save</button>
           </div>
        }
        <MediaQuery minDeviceWidth={1224}>
          <button title="Reset Map" className='undo_button' style={undoButtonStyle} onClick={handleUndo}>
            <img src={reset} alt="RESET" style={undoIMGStyle}/>
          </button>
        </MediaQuery>
      </div>
      <MediaQuery minDeviceWidth={1224}>
        {isImported && <div style={{display: 'flex'}}>
          <textarea type="text" placeholder="PASTE COORDINATES" onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'PASTE COORDINATES\nFORMAT:\nlat, lon\nlat, lon\nlat, lon'} style={GEOJSONStyle}/>
        </div>}
      </MediaQuery>
      <MediaQuery minDeviceWidth={1224}>
        <p style={textOutputStyle}>
          {geojsonString}
        </p>
      </MediaQuery>
    </div>
  );
};

export default Sidebar;