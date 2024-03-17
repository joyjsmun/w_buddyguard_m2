// useGoogleMaps.ts
import { useState, useEffect } from "react";

const useGoogleMaps = () => {
  const [googleMapsReady, setGoogleMapsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        setGoogleMapsReady(true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setGoogleMapsReady(true);
    }
  }, []);

  return googleMapsReady;
};

export default useGoogleMaps;
