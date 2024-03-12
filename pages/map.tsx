import { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import Layout from "@/components/layout";
import initializeFirebaseClient from "../lib/initFirebase";
import { getAuth } from "firebase/auth";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";

interface UserLocation {
  location: {
    latitude: number;
    longitude: number;
  };
}

const getUserColor = (userId: string) => {
  // Define a color mapping based on user IDs
  const colorMap: Record<string, string> = {
    user1: "red",
    user2: "blue",
    // Add more user-color mappings as needed
  };

  // Return the color for the given user ID, or a default color if not found
  return colorMap[userId] || "green";
};

const { db: firestore } = initializeFirebaseClient();

const Map = () => {
  const containerStyle = { width: "100%", height: "100vh" };
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [userLocations, setUserLocations] = useState<
    Record<string, UserLocation>
  >({});

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback(
    function callback(map: any) {
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
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Update the user's location in Firestore
          const auth = getAuth();
          const userId = auth.currentUser?.uid;
          if (userId) {
            const userRef = doc(firestore, "users", userId);
            setDoc(
              userRef,
              { location: { latitude, longitude } },
              { merge: true }
            );
          }
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

    // Listen for changes in user locations
    const unsubscribe = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        const locations = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data() as UserLocation;
          return acc;
        }, {} as Record<string, UserLocation>);
        setUserLocations(locations);
      }
    );

    return () => {
      // Clean up the listener when the component unmounts
      unsubscribe();
    };
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
            {/* Marker for the user's current location */}
            {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
              <Marker position={currentLocation} />
            )}

            {/* Markers for other users */}
            {Object.entries(userLocations).map(([userId, { location }]) => (
              <Marker
                key={userId}
                position={{ lat: location.latitude, lng: location.longitude }}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: getUserColor(userId),
                  fillOpacity: 1,
                  strokeWeight: 0,
                }}
                label={{
                  text: userId.slice(0, 6),
                  color: "blue",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div>Loading failed</div>
        )}
      </div>
    </Layout>
  );
};

export default Map;
