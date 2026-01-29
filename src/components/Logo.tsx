
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7 text-green-600"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C8 2 6 5 6 9C6 14 9 20 12 22C15 20 18 14 18 9C18 5 16 2 12 2Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
          <path
            d="M10 14C10.5 15 13.5 15 14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 2V4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-2xl font-extrabold tracking-tight text-slate-800">
        Snack<span className="text-blue-600">Stock</span>
      </span>
    </div>
  );
};

export default Logo;
