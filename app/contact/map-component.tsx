'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Default coordinates (New York)
const DEFAULT_COORDS = {
  lat: 40.7128,
  lng: -74.0060
};

// Create a completely server-side excluded component
const LeafletMap = dynamic(
  () => import('./leaflet-map'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    )
  }
);

export default function MapComponent() {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-500">Error loading map: {error}</p>
      </div>
    );
  }

  return (
    <LeafletMap 
      defaultCoords={DEFAULT_COORDS} 
      onError={(err) => setError(err.message)} 
    />
  );
} 