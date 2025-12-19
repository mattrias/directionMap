import { useState, useRef, useEffect } from 'react';

function LocationInput({ 
  value, 
  onChange, 
  onSelect,
  placeholder, 
  onFocus, 
  isActive 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` +
            `format=json` +
            `&q=${encodeURIComponent(query)}` +
            `&countrycodes=ph` +
            `&viewbox=116.9283,4.5693,126.6043,21.1207` +
            `&bounded=1` +
            `&limit=8` +
            `&addressdetails=1`,
            {
                headers: { 'User-Agent': 'RouteFormApp/1.0' }
            }
            );
            
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    fetchSuggestions(newValue);
  };

  const handleSelectSuggestion = (suggestion) => {
    const displayName = suggestion.display_name;
    onChange(displayName);
    onSelect({
      address: displayName,
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    });
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative flex-1 z-[1000]">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          onFocus();
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        className={`border p-2 rounded w-full transition-all ${
          isActive ? "border-blue-500 ring-2 ring-blue-200" : ""
        }`}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg max-h-60"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id || index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-900">
                {suggestion.display_name.split(',')[0]}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {suggestion.display_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RouteForm({
  startLocation,
  endLocation,
  setStartLocation,
  setEndLocation,
  onSubmit,
  setActiveInput,
  activeInput,
  loading,
}) {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startLocation || !endLocation) return;

    onSubmit(
      startLocation, 
      endLocation,
      startCoords,
      endCoords
    );
  };

  return (
    <div className="flex gap-2 mb-6">
      <LocationInput
        value={startLocation}
        onChange={setStartLocation}
        onSelect={(location) => {
          setStartLocation(location.address);
          setStartCoords({ lat: location.lat, lon: location.lon });
        }}
        placeholder="From Location"
        onFocus={() => setActiveInput("start")}
        isActive={activeInput === "start"}
      />
      
      <LocationInput
        value={endLocation}
        onChange={setEndLocation}
        onSelect={(location) => {
          setEndLocation(location.address);
          setEndCoords({ lat: location.lat, lon: location.lon });
        }}
        placeholder="To Location"
        onFocus={() => setActiveInput("end")}
        isActive={activeInput === "end"}
      />
      
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? "Saving..." : "Save Route"}
      </button>
    </div>
  );
}