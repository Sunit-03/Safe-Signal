import React, { useEffect, useState } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    const geoSuccess = (position) => {
        const {latitude, longitude, accuracy} = position.coords;
      setLocation({
        latitude,
        longitude,
        accuracy
      });
      setError(null);
    };
    const geoError = (error) => {
      setError(error.message || "Location permission failed");
    };
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
    );
  }, []);
  return {location, error};
};

export default useGeoLocation;
