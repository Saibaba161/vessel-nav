import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const vesselIcon = new Icon({
  iconUrl: '../assets/Frame 334.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const startIcon = new Icon({
    iconUrl: '../assets/location_svgrepo.com (1).png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const endIcon = new Icon({
    iconUrl: '../assets/location_svgrepo.com (2).png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const VesselMovement = ({ startCoords, endCoords, speed, refreshRate, setPosition }) => {
  const map = useMap();

  React.useEffect(() => {
    const latDiff = endCoords[0] - startCoords[0];
    const lngDiff = endCoords[1] - startCoords[1];
    const distance = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111.32; // km
    const duration = (distance / speed) * 3600; // seconds

    const steps = duration * refreshRate;
    const latStep = latDiff / steps;
    const lngStep = lngDiff / steps;

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
  }, [map, startCoords, endCoords, speed, refreshRate, setPosition]);

  return null;
};

const VesselNavigationMap = () => {
  const [startCoords, setStartCoords] = useState([22.1696, 91.4996]);
  const [endCoords, setEndCoords] = useState([22.2637, 91.7159]);
  const [speed, setSpeed] = useState(20);
  const [refreshRate, setRefreshRate] = useState(2);
  const [position, setPosition] = useState(startCoords);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  const handleStartSimulation = (e) => {
    e.preventDefault();
    setPosition(startCoords);
    setIsSimulationRunning(true);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', padding: '20px' }}>
        <form onSubmit={handleStartSimulation}>
          <h3>Navigation Settings</h3>
          <label>
            Start Coordinates:
            <input
              type="text"
              value={startCoords.join(', ')}
              onChange={(e) => setStartCoords(e.target.value.split(',').map(Number))}
            />
          </label>

          <label>
            End Coordinates:
            <input
              type="text"
              value={endCoords.join(', ')}
              onChange={(e) => setEndCoords(e.target.value.split(',').map(Number))}
            />
          </label>

          <label>
            Speed (km/h):
            <input
              type="number"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </label>

          <label>
            Refresh Rate (FPS):
            <input
              type="number"
              value={refreshRate}
              onChange={(e) => setRefreshRate(Number(e.target.value))}
            />
          </label>

          <button type="submit">Start</button>
        </form>
      </div>

      <div style={{ flex: 1 }}>
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

        <Marker position={position} icon={vesselIcon}>
            <Popup>Vessel</Popup>
        </Marker>

        <Polyline positions={[startCoords, endCoords]} color="red" />
          {isSimulationRunning && (
            <VesselMovement
              startCoords={startCoords}
              endCoords={endCoords}
              speed={speed}
              refreshRate={refreshRate}
              setPosition={setPosition}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default VesselNavigationMap;