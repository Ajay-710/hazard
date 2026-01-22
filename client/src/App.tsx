import { useState, useEffect } from 'react'
import Map from './components/Map'
import Sidebar from './components/Sidebar'
import axios from 'axios'

function App() {
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number, lng: number, name: string } | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][] | undefined>(undefined);
  const [routeInfo, setRouteInfo] = useState<{ distance: string, duration: string } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
          // Default to San Francisco
          setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
      );
    } else {
      setUserLocation({ lat: 37.7749, lng: -122.4194 });
    }
  }, []);

  const handlePlaceSelect = (place: { lat: number, lng: number, name: string }) => {
    setDestination(place);
    setRoutePath(undefined);
    setRouteInfo(null);
  }

  const handleGetDirections = async () => {
    if (!userLocation || !destination) return;

    try {
      const start = `${userLocation.lng},${userLocation.lat}`;
      const end = `${destination.lng},${destination.lat}`;
      const url = `http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

      const response = await axios.get(url);
      const route = response.data.routes[0];

      if (route) {
        const coords = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]) as [number, number][];
        setRoutePath(coords);

        const distKm = (route.distance / 1000).toFixed(1);
        const durMin = Math.round(route.duration / 60);

        let durationStr = `${durMin} min`;
        if (durMin > 60) {
          const hours = Math.floor(durMin / 60);
          const mins = durMin % 60;
          durationStr = `${hours} hr ${mins} min`;
        }

        setRouteInfo({
          distance: `${distKm} km`,
          duration: durationStr
        });
      }

    } catch (error) {
      console.error("Error fetching directions", error);
      alert("Could not fetch directions. Please try again.");
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#e5e3df] text-gray-800 font-sans selection:bg-blue-100">
      <Sidebar
        onPlaceSelect={handlePlaceSelect}
        destination={destination}
        onGetDirections={handleGetDirections}
        routeInfo={routeInfo}
      />
      <div className="flex-1 relative z-0">
        <Map
          center={userLocation || { lat: 37.7749, lng: -122.4194 }}
          zoom={13}
          userLocation={userLocation}
          destination={destination}
          routePath={routePath}
        />
      </div>
    </div>
  )
}

export default App
