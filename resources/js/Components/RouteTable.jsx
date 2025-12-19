import React, { useState } from "react";
import Checkbox from "./Checkbox";
import EditRouteModal from "./EditRouteModal";
import { Edit, Trash2, Map } from "lucide-react";

export default function RouteTable({ 
  routes, 
  onDelete, 
  onUpdate, 
  onBulkDelete, 
  onSelect, 
  selectedRouteId 
}) {
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRoutes([]);
    } else {
      setSelectedRoutes(routes.map(r => r.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRoute = (id) => {
    if (selectedRoutes.includes(id)) {
      setSelectedRoutes(selectedRoutes.filter(routeId => routeId !== id));
    } else {
      setSelectedRoutes([...selectedRoutes, id]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRoutes.length === 0) return;
    
    if (window.confirm(`Delete ${selectedRoutes.length} selected route(s)?`)) {
      onBulkDelete(selectedRoutes);
      setSelectedRoutes([]);
      setSelectAll(false);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
  };

  const handleSaveEdit = (id, startLocation, endLocation) => {
    onUpdate(id, startLocation, endLocation);
    setEditingRoute(null);
  };

  return (
    <>
      <div className="overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Bulk Actions Bar */}
        {selectedRoutes.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-200 bg-blue-50">
            <span className="text-sm font-medium text-blue-800">
              {selectedRoutes.length} route(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}

        <div className="overflow-auto max-h-[600px]">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="w-12 p-3 text-center border-r">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 font-semibold text-left text-gray-700 border-r">Start Location</th>
                <th className="p-3 font-semibold text-left text-gray-700 border-r">End Location</th>
                <th className="w-32 p-3 font-semibold text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-gray-500">
                    <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No routes yet</p>
                    <p className="text-sm">Add your first route to get started</p>
                  </td>
                </tr>
              ) : (
                routes.map((route) => {
                  const isSelected = selectedRouteId === route.id;
                  const isChecked = selectedRoutes.includes(route.id);
                  
                  return (
                    <tr
                      key={route.id}
                      onClick={() => onSelect(route.id)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors border-b ${
                        isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                    >
                      <td className="p-3 text-center border-r">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleSelectRoute(route.id)}
                        />
                      </td>
                      <td className="p-3 text-sm border-r">{route.start_location}</td>
                      <td className="p-3 text-sm border-r">{route.end_location}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(route);
                            }}
                            className="p-1.5 text-blue-600 transition-colors rounded hover:text-blue-800 hover:bg-blue-50"
                            title="Edit route"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("Delete this route?")) {
                                onDelete(route.id);
                              }
                            }}
                            className="p-1.5 text-red-600 transition-colors rounded hover:text-red-800 hover:bg-red-50"
                            title="Delete route"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingRoute && (
        <EditRouteModal
          route={editingRoute}
          onClose={() => setEditingRoute(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}