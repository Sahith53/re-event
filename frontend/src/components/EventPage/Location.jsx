import React, { useEffect } from 'react';
import { GOOGLE_MAPS_API } from '../../config/api';

const Location = ({ location }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = GOOGLE_MAPS_API.PLACES(apiKey);
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    const mapOptions = {
      zoom: 14,
      center: { lat: 30, lng: 78 }, // Initial center, will be updated with the provided location
    };

    // Initialize Google Map
    const map = new window.google.maps.Map(document.getElementById('map'), mapOptions);

    // Set the center of the map to the provided location
    map.setCenter(location);
    
    // Add a marker for the location
    new window.google.maps.Marker({
      position: location,
      map,
      title: location || '',
    });
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-600 bg-zinc-800">
      <div className="w-full">
        <div id="map" className="w-full rounded-t-2xl" style={{ height: '250px' }}></div>
      </div>
      <div className="w-full flex flex-col items-start justify-center py-2 px-4">
        <h1 className="text-lg">{location}</h1>
      </div>
    </div>
  );
};

export default Location;
