'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Need to import leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix icon issue in Leaflet with CDN URLs
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle user's real-time location
function LocationMarker({ defaultCoords }: { defaultCoords: { lat: number, lng: number } }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationFound, setLocationFound] = useState(false);
  const map = useMap();

  useEffect(() => {
    try {
      map.locate({ setView: true, maxZoom: 16 });
      
      map.on('locationfound', (e) => {
        setPosition(e.latlng);
        setAccuracy(e.accuracy);
        setLocationFound(true);
        map.flyTo(e.latlng, 16);
      });

      map.on('locationerror', () => {
        console.log('Location access denied or not available');
        // Fallback to default location
        map.setView([defaultCoords.lat, defaultCoords.lng], 13);
      });

      return () => {
        map.off('locationfound');
        map.off('locationerror');
      };
    } catch (error) {
      console.error('Error in location marker:', error);
      map.setView([defaultCoords.lat, defaultCoords.lng], 13);
    }
  }, [map, defaultCoords]);

  return locationFound && position ? (
    <Marker position={position} icon={DefaultIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-medium">Your current location</p>
          {accuracy && <p className="text-sm text-gray-500">Accuracy: ~{Math.round(accuracy)} meters</p>}
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// Store Location Marker
function StoreMarker({ defaultCoords }: { defaultCoords: { lat: number, lng: number } }) {
  return (
    <Marker 
      position={[defaultCoords.lat, defaultCoords.lng]} 
      icon={DefaultIcon}
    >
      <Popup>
        <div>
          <h3 className="font-medium">NovaBuy Store</h3>
          <p className="text-sm text-gray-600">
            123 Commerce Street<br />
            Shopping District<br />
            New York, NY 10001
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

interface LeafletMapProps {
  defaultCoords: { lat: number, lng: number };
  onError: (error: Error) => void;
}

export default function LeafletMap({ defaultCoords, onError }: LeafletMapProps) {
  useEffect(() => {
    try {
      // Fix icon paths issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });
    } catch (error) {
      console.error('Error setting up Leaflet:', error);
      onError(error instanceof Error ? error : new Error('Unknown error setting up map'));
    }
  }, [onError]);

  return (
    <MapContainer 
      center={[defaultCoords.lat, defaultCoords.lng]} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <StoreMarker defaultCoords={defaultCoords} />
      <LocationMarker defaultCoords={defaultCoords} />
    </MapContainer>
  );
} 