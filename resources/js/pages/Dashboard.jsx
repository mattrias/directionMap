import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import MapView from "../Components/MapView";
import RouteForm from "../Components/RouteForm";
import RouteTable from "../Components/RouteTable";
import Navbar from "../Components/Navbar";

export default function Dashboard() {
  const { routes: initialRoutes } = usePage().props;

  const [routes, setRoutes] = useState(initialRoutes);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [activeInput, setActiveInput] = useState("start");
  const [selectedRouteId, setSelectedRouteId] = useState(
    initialRoutes.length ? initialRoutes[0].id : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clearMarkers, setClearMarkers] = useState(0);

  const addRoute = (start, end) => {
    setLoading(true);
    setError("");

    router.post(
      "/routes",
      { start_location: start, end_location: end },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          setRoutes(page.props.routes);
          setClearMarkers((prev) => prev + 1);
          setStartLocation("");
          setEndLocation("");
        },
        onError: (errors) => {
          setError(Object.values(errors).flat().join(", "));
        },
        onFinish: () => setLoading(false),
      }
    );
  };

  const deleteRoute = (id) => {
    router.delete(`/routes/${id}`, {
      preserveScroll: true,
      onSuccess: (page) => {
        setRoutes(page.props.routes);
        if (selectedRouteId === id) setSelectedRouteId(null);
      },
      onError: (errors) => {
        console.error(errors);
      },
    });
  };

  const updateRoute = (id, startLocation, endLocation) => {
    router.put(`/routes/${id}`, 
      { start_location: startLocation, end_location: endLocation },
      {
        preserveScroll: true,
        onSuccess: (page) => {
          setRoutes(page.props.routes);
        },
        onError: (errors) => {
          console.error(errors);
        },
      }
    );
  };

  const bulkDeleteRoutes = (ids) => {
    router.delete('/routes/bulk', 
      { 
        data: { ids },
        preserveScroll: true,
        onSuccess: (page) => {
          setRoutes(page.props.routes);
          if (ids.includes(selectedRouteId)) setSelectedRouteId(null);
        },
        onError: (errors) => {
          console.error(errors);
        },
      }
    );
  };

  const handleMapClick = ({ lat, lng, address }) => {
    if (activeInput === "start") setStartLocation(address);
    else setEndLocation(address);
  };

  const handleRouteSelect = (id) => setSelectedRouteId(id);

  const handleLogout = (e) => {
    e.preventDefault();
    router.post("/logout");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      
      <div className="p-6 mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Direction Map Dashboard
        </h1>

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 border-l-4 border-red-500 bg-red-50">
            <div className="flex">
              <div className="flex-shrink-0">
                
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-red-700">Error Details:</p>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Route Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 z-[1000]">
          <RouteForm
            startLocation={startLocation}
            endLocation={endLocation}
            setStartLocation={setStartLocation}
            setEndLocation={setEndLocation}
            onSubmit={addRoute}
            setActiveInput={setActiveInput}
            activeInput={activeInput}
            loading={loading}
          />
        </div>

        {/* Map and Table Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Map View</h2>
              <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
                <MapView
                  routes={routes}
                  onMapClick={handleMapClick}
                  activeInput={activeInput}
                  selectedRouteId={selectedRouteId}
                  clearMarkers={clearMarkers}
                />
              </div>
            </div>
          </div>

          {/* Route Table */}
          <div className="lg:col-span-1 z-[1000]">
            <RouteTable
              routes={routes}
              onDelete={deleteRoute}
              onUpdate={updateRoute}
              onBulkDelete={bulkDeleteRoutes}
              onSelect={handleRouteSelect}
              selectedRouteId={selectedRouteId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}