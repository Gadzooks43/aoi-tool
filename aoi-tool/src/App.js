import React, { useEffect, useState, useRef } from 'react';
import Map from './Map';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [mapCoordinateView, setMapCoordinateView] = useState(null);

  const handleMarkerUpdate = (newMarker) => {
    setMarkers(currentMarkers => [...currentMarkers, newMarker]);
  };

  const handlePolygonClosed = (newPolygon) => {
    setPolygons(currentPolygons => [...currentPolygons, newPolygon]);
  }

  return (
    <div className="App">
      <Header className="App-header" setMapCoordinateView={setMapCoordinateView}/>
      <div className="content" style={{ display: "flex" }}>
        <div className="column">
          <Map className="map" handleMarkerUpdate={handleMarkerUpdate} handlePolygonClosed={handlePolygonClosed} mapCoordinateView={mapCoordinateView}/>
        </div>
        <div className="column">
          <Sidebar className="sidebar" polygons={polygons} setMapCoordinateView={setMapCoordinateView}/>
        </div>
      </div>
    </div>
  );
};
export default App;