import { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import Layout from "@/components/layout";
import initializeFirebaseClient from "../lib/initFirebase";
import { getAuth, User } from "firebase/auth";
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  getDoc,
} from "firebase/firestore";

interface UserLocation {
  location: {
    latitude: number;
    longitude: number;
  };
  lastUpdated: any;
  previousLocation: {
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

const Map = ({
  preview,
  showOthers,
  userLocations = {},
  currentUser = null,
  onInfoWindowData = () => {},
}: {
  preview: boolean;
  showOthers: boolean;
  userLocations?: Record<string, UserLocation>;
  currentUser?: User | null;
  onInfoWindowData?: (data: string | null) => void;
}) => {
  const containerStyle = {
    width: "100%",
    height: preview ? "30vh" : "100vh",
    borderRadius: preview ? "8px" : "0",
    overflow: "hidden",
  };
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const infoWindowData = getInfoWindowData();
    onInfoWindowData(infoWindowData);
  }, [userLocations, currentUser]);

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

  const updateUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          // Update the user's location in Firestore with timestamp and previous location
          const userId = currentUser?.uid;
          if (userId) {
            const userRef = doc(firestore, "users", userId);
            const userSnapshot = await getDoc(userRef);
            const userData = userSnapshot.data() as UserLocation;

            await setDoc(
              userRef,
              {
                location: {
                  latitude,
                  longitude,
                },
                lastUpdated: serverTimestamp(),
                previousLocation: userData?.location || null,
              },
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
    const updateInterval = setInterval(updateUserLocation, 3000); // Update every 3 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(updateInterval);
    };
  }, [currentUser]);

  const handleMarkerClick = (userId: string) => {
    setSelectedMarker(userId);
  };

  const handleMarkerClose = () => {
    setSelectedMarker(null);
  };

  const getInfoWindowData = () => {
    if (currentUser?.uid && userLocations[currentUser.uid]) {
      const { lastUpdated, previousLocation } = userLocations[currentUser.uid];
      return `Last Updated: ${lastUpdated
        ?.toDate()
        .toLocaleString()}, Previous Location (30s ago): ${
        previousLocation?.latitude
      }, ${previousLocation?.longitude}`;
    }
    return null;
  };

  return (
    <Layout>
      <div className="">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentLocation}
            zoom={18}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Marker for the user's current location */}
            {currentLocation.lat !== 0 && currentLocation.lng !== 0 && (
              <Marker
                position={currentLocation}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: "blue",
                  fillOpacity: 1,
                  strokeWeight: 0,
                }}
                label={{
                  text: "Current User",
                  color: "Red",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
                animation={google.maps.Animation.BOUNCE}
                onClick={() => handleMarkerClick(currentUser?.uid || "")}
              >
                {selectedMarker === currentUser?.uid && (
                  <InfoWindow onCloseClick={handleMarkerClose}>
                    <div>
                      <p>Current Location</p>
                      <p>
                        Last Updated:{" "}
                        {userLocations[currentUser?.uid || ""]?.lastUpdated
                          ?.toDate()
                          .toLocaleString()}
                      </p>
                      <p>
                        Previous Location (30s ago):{" "}
                        {
                          userLocations[currentUser?.uid || ""]
                            ?.previousLocation?.latitude
                        }
                        ,{" "}
                        {
                          userLocations[currentUser?.uid || ""]
                            ?.previousLocation?.longitude
                        }
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            )}

            {/* Markers for other users */}
            {showOthers &&
              userLocations &&
              Object.entries(userLocations).map(([userId, userLocation]) => {
                const location = userLocation?.location;
                if (location && userId !== currentUser?.uid) {
                  return (
                    <Marker
                      key={userId}
                      position={{
                        lat: location.latitude,
                        lng: location.longitude,
                      }}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: getUserColor(userId),
                        fillOpacity: 1,
                        strokeWeight: 0,
                      }}
                      label={{
                        text: userId.slice(0, 6),
                        color: "Green",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                      animation={google.maps.Animation.BOUNCE}
                      onClick={() => handleMarkerClick(userId)}
                    >
                      {selectedMarker === userId && (
                        <InfoWindow onCloseClick={handleMarkerClose}>
                          <div>
                            <p>User: {userId.slice(0, 6)}</p>
                            <p>
                              Last Updated:{" "}
                              {userLocation?.lastUpdated
                                ?.toDate()
                                .toLocaleString()}
                            </p>
                            <p>
                              Previous Location (30s ago):{" "}
                              {userLocation?.previousLocation?.latitude},{" "}
                              {userLocation?.previousLocation?.longitude}
                            </p>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  );
                }
                return null;
              })}
          </GoogleMap>
        ) : (
          <div>Loading failed</div>
        )}
      </div>
    </Layout>
  );
};

export default Map;
