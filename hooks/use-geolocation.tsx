import { useState } from "react";

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
  };

  setIsLoading(true);
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setIsLoading(false);
    },
    (error) => {
      setError("Unable to retrieve your location");
      setIsLoading(false);
    }
  );
  return { location, error, isLoading, getLocation };
};
