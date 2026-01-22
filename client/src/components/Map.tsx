import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// Google Maps-ish Icons (Red Pin)
const GoogleIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const BlueIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    center: { lat: number, lng: number };
    zoom: number;
    userLocation: { lat: number, lng: number } | null;
    destination: { lat: number, lng: number, name: string } | null;
    routePath?: [number, number][];
}

function MapUpdater({ center, zoom }: { center: { lat: number, lng: number }, zoom?: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }
    }, [center, zoom, map]);
    return null;
}

export default function Map({ center, zoom, userLocation, destination, routePath }: MapProps) {
    return (
        <MapContainer center={center} zoom={zoom} zoomControl={false} scrollWheelZoom={true} className="h-full w-full outline-none z-0 bg-[#e5e3df]">
            {/* Google Maps equivalent styling using Carto Voyager */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <ZoomControl position="bottomright" />

            {userLocation && (
                <Marker position={userLocation} icon={BlueIcon}>
                    <Popup className="font-sans font-medium text-sm">
                        You are here
                    </Popup>
                </Marker>
            )}

            {destination && (
                <Marker position={destination} icon={GoogleIcon}>
                    <Popup className="font-sans">
                        <div className="font-medium text-gray-900">{destination.name.split(',')[0]}</div>
                        <div className="text-gray-500 text-xs mt-1">{destination.name}</div>
                    </Popup>
                </Marker>
            )}

            {routePath && (
                <Polyline
                    positions={routePath}
                    color="#4285F4" // Google Blue
                    weight={5}
                    opacity={0.9}
                />
            )}

            <MapUpdater center={destination || center} zoom={destination ? 14 : zoom} />
        </MapContainer>
    )
}
