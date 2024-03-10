import { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import Layout from "@/components/layout";

const Map = () => {
  const containerStyle = { width: "100%", height: "100vh" };
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    function callback(map) {
      if (currentLocation.lat !== 0 && currentLocation.lng !== 0) {
        map.setCenter(currentLocation);
      }
      setMap(map);
    },
    [currentLocation]
  );

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error getting location");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Layout>
      <div className="mt-12">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Optionally, you can add a marker for the user's current location */}
            {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
              <Marker position={currentLocation} />
            )}
          </GoogleMap>
        ) : (
          <div>Loading failed</div>
        )}
      </div>
    </Layout>
  );
};

export default Map;
