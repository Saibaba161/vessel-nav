import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

const RotatedMarker = ({ position, rotation, icon }) => {
  const rotatedIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div style="transform: rotate(${rotation}deg);">
             <img src="${icon.options.iconUrl}" style="width: 60px; height: 20px;" />
           </div>`,
    iconSize: [60, 20],
    iconAnchor: [25, 25],
  });

  return <Marker position={position} icon={rotatedIcon} />;
};

export default RotatedMarker;