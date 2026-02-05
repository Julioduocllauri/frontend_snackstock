import React, { useState } from 'react';
import { HelpCircle, X, RefreshCw } from 'lucide-react';

interface HelpButtonProps {
  onRestartTour: () => void;
  tourKey: string;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onRestartTour, tourKey }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleRestartTour = () => {
    localStorage.removeItem(tourKey);
    setShowMenu(false);
    onRestartTour();
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="Ayuda"
      >
        {showMenu ? (
          <X className="w-6 h-6" />
        ) : (
          <HelpCircle className="w-6 h-6 group-hover:animate-pulse" />
        )}
      </button>

      {/* Menú desplegable */}
      {showMenu && (
        <div className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-64 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            ¿Necesitas ayuda?
          </h3>
          
          <button
            onClick={handleRestartTour}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all text-left group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Guía</p>
              <p className="text-xs text-slate-500">Ver tutorial nuevamente</p>
            </div>
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default HelpButton;
