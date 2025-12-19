import React, { useState, useEffect,useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";





delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


function FitBounds({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (routes.length > 0) {
      const bounds = [];
      routes.forEach((route) => {
        bounds.push([route.start_lat, route.start_lng]);
        bounds.push([route.end_lat, route.end_lng]);
      });
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [routes, map]);

  return null;
}


function ClickableMap({ onClick, activeInput, clearMarkers }) {
  const map = useMap();
  const markerLayerRef = useRef(null);


  useEffect(() => {
    markerLayerRef.current = L.layerGroup().addTo(map);
    
    return () => {
      if (markerLayerRef.current) {
        markerLayerRef.current.clearLayers();
        map.removeLayer(markerLayerRef.current);
      }
    };
  }, [map]);

  // Clear markers 
  useEffect(() => {
    if (markerLayerRef.current) {
      markerLayerRef.current.clearLayers();
    }
  }, [clearMarkers]);

  useEffect(() => {
    const handleClick = async (e) => {
      const { lat, lng } = e.latlng;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const address = data.display_name || "Unknown location";

        // Clear previous markers first
        if (markerLayerRef.current) {
          markerLayerRef.current.clearLayers();
        }

        // Add new marker to LayerGroup
        const icon = activeInput === "start" ? startIcon : endIcon;
        const marker = L.marker([lat, lng], { icon })
          .bindPopup(`<strong>${activeInput === "start" ? "Start" : "End"}:</strong> ${address}`)
          .addTo(markerLayerRef.current);

        onClick({ lat, lng, address });
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onClick, activeInput]);

  return null;
}

// Component to display a single route with OSRM routing
function RoutePolyline({ route, isSelected }) {
  const [routePath, setRoutePath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (route.path_coordinates && route.path_coordinates.length > 0) {
      const coordinates = route.path_coordinates.map(
        (coord) => [coord[1], coord[0]]
      );
      setRoutePath(coordinates);
      setLoading(false);
      return;
    }
    
    // Fallback to OSRM
    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${route.start_lng},${route.start_lat};${route.end_lng},${route.end_lat}?overview=full&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === "Ok" && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          );
          setRoutePath(coordinates);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [route]);

  if (loading || routePath.length === 0) {
    return null;
  }


  return (
    <>
      <Polyline
        positions={routePath}
        color={isSelected ? "#3B82F6" : "#6B7280"}
        weight={isSelected ? 5 : 3}
        opacity={isSelected ? 0.8 : 0.5}
      />
      <Marker position={[route.start_lat, route.start_lng]} icon={startIcon}>
        <Popup>
          <strong>Start:</strong> {route.start_location}
        </Popup>
      </Marker>
      <Marker position={[route.end_lat, route.end_lng]} icon={endIcon}>
        <Popup>
          <strong>End:</strong> {route.end_location}
        </Popup>
      </Marker>
    </>
  );
}

export default function MapView({ routes, onMapClick, activeInput, selectedRouteId, clearMarkers }) {
  const defaultPosition = [14.5995, 120.9842]; // Manila

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      className="w-full h-full rounded"
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ClickableMap 
        onClick={onMapClick} 
        activeInput={activeInput}
        clearMarkers={clearMarkers}
      />
      <FitBounds routes={routes} />
      
      {routes.map((route) => (
        <RoutePolyline
          key={`${route.id}-${selectedRouteId === route.id}`}
          route={route}
          isSelected={selectedRouteId === route.id}
        />
      ))}
    </MapContainer>
  );
}