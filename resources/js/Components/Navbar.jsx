import React from "react";
import { Map, LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  return (
    <nav className="text-white shadow-lg">
      <div className="px-6 py-4 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Map className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-700">Direction Map</h1>
              <p className="text-xs text-gray-400">Route Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 font-medium text-white transition-all duration-200 transform bg-red-600 rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}