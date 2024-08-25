import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import RotatedMarker from './rotatedmarker';

const startIcon = new L.Icon({
    iconUrl: '../assets/location_svgrepo.com (1).png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const endIcon = new L.Icon({
    iconUrl: '../assets/location_svgrepo.com (2).png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const vesselIcon = new L.Icon({
  iconUrl: '../assets/Frame 334.png',
  iconSize: [62, 32],
  iconAnchor: [16, 32],
});

const VesselMovement = ({ startCoords, endCoords, speed, refreshRate, setPosition, setRotation }) => {
  const map = useMap();

  React.useEffect(() => {
    const latDiff = endCoords[0] - startCoords[0];
    const lngDiff = endCoords[1] - startCoords[1];
    const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111.32; // km
    const duration = (distance / speed) * 3600; // seconds

    const steps = duration * refreshRate;
    const latStep = latDiff / steps;
    const lngStep = lngDiff / steps;

    const initialAngle = (Math.atan2(lngDiff, latDiff) * 180 / Math.PI) - 90;
    setRotation(initialAngle);

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(interval);
        return;
      }

      const newLat = startCoords[0] + latStep * currentStep;
      const newLng = startCoords[1] + lngStep * currentStep;
      setPosition([newLat, newLng]);

      map.panTo([newLat, newLng]);
      currentStep++;
    }, 1000 / refreshRate);

    return () => clearInterval(interval);
  }, [map, startCoords, endCoords, speed, refreshRate, setPosition, setRotation]);

  return null;
};

const VesselNavigationMap = () => {
  const [startCoords, setStartCoords] = useState([22.1696, 91.4996]);
  const [endCoords, setEndCoords] = useState([22.2637, 91.7159]);
  const [speed, setSpeed] = useState(20);
  const [refreshRate, setRefreshRate] = useState(2);
  const [position, setPosition] = useState(startCoords);
  const [rotation, setRotation] = useState(90);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const handleStartSimulation = (e) => {
    e.preventDefault();
    setPosition(startCoords);
    setIsSimulationRunning(true);

    alert('Simulation Started')
  };

  return (
    <div className='input-form'>
      <div className='form-container'>
        <form onSubmit={handleStartSimulation}>
          <h3>Navigation Settings</h3>

          <label>
            Start Coordinates:
          </label>
            <input
              type="text"
              value={startCoords.join(', ')}
              onChange={(e) => setStartCoords(e.target.value.split(',').map(Number))}
            />
            <br />

          <label>
            End Coordinates:
          </label>
            <input
              type="text"
              value={endCoords.join(', ')}
              onChange={(e) => setEndCoords(e.target.value.split(',').map(Number))}
            />
            <br />

          <label>
            Speed (km/h):
          </label>
            <input
              type="number"
              className='inputs'
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <br />

          <label>
            Refresh Rate (FPS):
          </label>
            <input
              type="number"
              className='inputs'
              value={refreshRate}
              onChange={(e) => setRefreshRate(Number(e.target.value))}
            />
          <br />

          <button type="submit">Start Simulation</button>
        </form>
      </div>

      <div className='map-container'>
        <MapContainer
          center={startCoords}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

        <Marker position={startCoords} icon={startIcon}>
            <Popup>Start Point</Popup>
        </Marker>
          
        <Marker position={endCoords} icon={endIcon}>
            <Popup>End Point</Popup>
        </Marker>

        {isSimulationRunning && (
            <RotatedMarker 
              position={position} 
              icon={vesselIcon}
              rotation={rotation}
            >
              <Popup>Vessel</Popup>
            </RotatedMarker>
          )}

          {isSimulationRunning && (
            <VesselMovement
              startCoords={startCoords}
              endCoords={endCoords}
              speed={speed}
              refreshRate={refreshRate}
              setPosition={setPosition}
              setRotation={setRotation}
            />
          )}
          
        </MapContainer>
      </div>
    </div>
  );
};

export default VesselNavigationMap;