import React, { useState } from "react";

export default function EditRouteModal({ route, onClose, onSave }) {
  const [startLocation, setStartLocation] = useState(route.start_location);
  const [endLocation, setEndLocation] = useState(route.end_location);

  const handleSave = () => {
    onSave(route.id, startLocation, endLocation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Edit Route</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Start Location</label>
            <input
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">End Location</label>
            <input
              type="text"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}