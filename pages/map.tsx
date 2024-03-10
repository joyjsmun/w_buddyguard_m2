import { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  MarkerF,
} from "@react-google-maps/api";
import Layout from "@/components/layout";

const locations = [
  {
    place: "Arco de Triunfo de Barcelona",
    latitude: 41.39218782850737,
    longitude: 2.1833596091062,
  },
  {
    place: "Visit Casa Mila",
    latitude: 41.39482777666461,
    longitude: 2.1613869520476627,
  },
  {
    place: "Tour La Sagrada Familia",
    latitude: 41.40438064044464,
    longitude: 2.1785255205402874,
  },
  {
    place: "Night Tour - Magic Fountain of Montjuïc",
    latitude: 41.3712561906769,
    longitude: 2.151748397811569,
  },
  {
    place: "Night Tennis",
    latitude: 41.380985812152396,
    longitude: 2.162306965964739,
  },
];

const Map = () => {
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };
  // const center = {
  //   Barcelona
  //   lat: 41.38707262727212,
  //   lng: 2.1700450041329127,

  // };

  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0,
  });

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds();
    locations.forEach((location) => {
      bounds.extend(
        new window.google.maps.LatLng(location.latitude, location.longitude)
      );
    });
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onMarkerClick = (marker: any) => {
    setSelectedMarker(marker);
  };

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
            {locations.map((location, index) => (
              <MarkerF
                key={index}
                position={{ lat: location.latitude, lng: location.longitude }}
                onClick={() => onMarkerClick(location)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.latitude,
                  lng: selectedMarker.longitude,
                }}
                // onCloseClick={() => setSelectedMarker(null)}
              >
                <div>{selectedMarker.place}</div>
              </InfoWindow>
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
