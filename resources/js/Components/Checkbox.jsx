import React from 'react';

export default function Checkbox({ 
  checked, 
  onChange, 
  label, 
  disabled = false,
  indeterminate = false, 
}) {
  const checkboxRef = React.useRef(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {label && (
        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  );
}