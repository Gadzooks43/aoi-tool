import React, { useEffect, useState } from 'react';
import undo from '../undo.png';
import MediaQuery from 'react-responsive';
import boveyeLogo from "../boveye_logo.png";

const buttonBoxStyle = {display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "5px 5px 15px 5px"};
const logoStyle = {maxHeight: "100px", maxWidth: "100px", margin:'auto'};
const dataButtonStyle = {margin: 'auto', display: 'block', padding: '10px 10px', marginLeft: '10px', textTransform: 'uppercase'};
const undoButtonStyle = {margin: 'auto', display: 'block', padding: '10px 10px', marginLeft: '5px'};
const undoIMGStyle = {maxHeight: '15px', maxWidth: '15px'};
const GEOJSONStyle = {marginLeft: '10px', width: '250px', height: '100px', resize: 'none'};
const textOutputStyle = {backgroundColor: 'grey', border: '1px solid lightgrey', padding: '5px 5px', margin: '10px 10px'};

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

  // get rid of all characters other than coordinates
  var string = geojsonString.replace(/[^0-9.,-]/g, '');

  // add spaces between coordinates
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
  // replace new lines with ", "
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
  // check if they are valid coordinates
  for (let i = 0; i < pairs.length; i++) {
    if (isNaN(pairs[i][0]) || isNaN(pairs[i][1])) {
      alert('Invalid coordinates');
      return null;
    }
  }
  // convert pairs to geojson polygon
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

const Sidebar = ({ polygons, setMapCoordinateView, setImportSoftReload }) => {
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
    setImportSoftReload(polygons);
    setIsImported(false);
  };

  const handleExport = (e) => {
    // download the geojson as a file
    const downloadGeojsonFile = () => {
      const filename = 'data.geojson';
      const data = JSON.stringify(geojson);

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
    // create undo state handler //
  };

  return (
    <div>
      <div style={buttonBoxStyle}>
        <MediaQuery maxDeviceWidth={1224}>
          <img className="logo" src={boveyeLogo} alt='Logo' style={logoStyle}/>
        </MediaQuery>
        <button className='data_button' style={dataButtonStyle} onClick={() => handleImport( isImported ? document.querySelector('textarea').value : '')}>Import</button>
        <button className='data_button' style={dataButtonStyle} onClick={handleExport}>Export</button>
        <MediaQuery minDeviceWidth={1224}>
          <button className='undo_button' style={undoButtonStyle} onClick={handleUndo}>
            <img src={undo} alt="Undo" style={undoIMGStyle}/>
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