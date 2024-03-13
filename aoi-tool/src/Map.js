import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { environment } from './environments/EnvDev.js';
import './App.css';

// Assign your Mapbox access token
mapboxgl.accessToken = environment.mapbox.accessToken;

const Map = ({ handleMarkerUpdate, handlePolygonClosed, mapCoordinateView }) => {
  const mapContainerRef = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-96.7026); // Longitude
  const [lat, setLat] = useState(40.8137); // Latitude
  const [zoom] = useState(10); // Zoom level
  const currentPoint = useRef(null); // [lng, lat]
  const firstPoint = useRef(null); // [lng, lat]
  const markers = useRef([]); // [lng, lat]

  useEffect(() => {
    if (mapCoordinateView) {
      console.log('Map Coordinate View: ', mapCoordinateView);
      setLng(mapCoordinateView[0]);
      setLat(mapCoordinateView[1]);
    }
  }, [mapCoordinateView]);

  // Initialize map when component mounts
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: `mapbox://styles/mapbox/satellite-v9`,
      center: [lng, lat],
      zoom: zoom,
      dragRotate: false,
      touchZoomRotate: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.on('load', () => {
      map.current.resize();
      map.current.addLayer({
        id: 'points_overlaps',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
        type: 'FeatureCollection',
        features: []
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#ffffff' // White color for the point
        }
      });

      map.current.addLayer({
        id: 'points',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#007cbf' // Blue color for the point
        }
      });

      map.current.addLayer({
        id: 'polyline',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'line-color': '#007cbf', // Blue color for the line
          'line-width': 2
        }
      });
      // Add polygon layer
      map.current.addLayer({
        id: 'polygon',
        type: 'fill',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'fill-color': '#007cbf', // Blue color for the polygon
          'fill-opacity': 0.4
        }
      });

      map.current.on('click', (e) => {
        // Create a GeoJSON feature for the clicked location
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [e.lngLat.lng, e.lngLat.lat]
          }
        };
        // get last point pushed from mapdata
        if (currentPoint.current !== null) {
          // Create a GeoJSON feature for the line
          const line = {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [currentPoint.current, [e.lngLat.lng, e.lngLat.lat]]
            }
          };

          // Get the current data of the polyline layer
          const data = map.current.getSource('polyline')._data;

          // Add the new line to the polyline layer
          data.features.push(line);
          map.current.getSource('polyline').setData(data);
        }

        // Get the current data of the points layer
        const data = map.current.getSource('points')._data;
        const overlaps = map.current.getSource('points_overlaps')._data;

        // Add the new feature to the points layer
        data.features.push(feature);
        overlaps.features.push(feature);
        map.current.getSource('points').setData(data);
        map.current.getSource('points_overlaps').setData(overlaps);

        // Pass the new point to the handleMarkerUpdate callback
        handleMarkerUpdate(e.lngLat);
        markers.current.push(e.lngLat);
        if (firstPoint.current === null) {
          firstPoint.current = [e.lngLat.lng, e.lngLat.lat];
        }
        currentPoint.current = [e.lngLat.lng, e.lngLat.lat]
      });

      map.current.on('contextmenu', (e) => {
        if (currentPoint.current === null || firstPoint.current === null) {
          return;
        }
        // Close the polygon
        const line = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [firstPoint.current, currentPoint.current]
          }
        };

        // Get the current data of the polyline layer
        const data = map.current.getSource('polyline')._data;

        // Add the new line to the polyline layer
        data.features.push(line);
        map.current.getSource('polyline').setData(data);  
        
        // add a polygon to the polygon layer based on markers
        const polygon = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [markers.current]
            }
          };
          
  
        // Get the current data of the polygon layer
        const polygonData = map.current.getSource('polygon')._data;
        // Add the new polygon to the polygon layer
        polygonData.features.push(polygon);
        map.current.getSource('polygon').setData(polygonData);

        // Pass the new polygon to the handlePolygonClosed callback
        handlePolygonClosed(polygon);
        markers.current = [];
        firstPoint.current = null;
        currentPoint.current = null;
      });
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, [lat, lng]); // Empty dependency array means this effect will only run once

  return (
    <div className="map-container" ref={mapContainerRef} style={{width: '80vw', height: '83vh', border: '3px solid #C2A770', borderRadius: '10px'}}/>
  );
};

export default Map;
