import React from 'react';
import { X, Lightbulb } from 'lucide-react';

interface ContextualTipProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
}

const ContextualTip: React.FC<ContextualTipProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  icon,
  position = 'top-right' 
}) => {
  if (!isOpen) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 animate-slideIn`}>
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl p-6 max-w-sm relative">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icono */}
        <div className="flex items-start gap-4 mb-3">
          <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
            {icon || <Lightbulb className="w-6 h-6" />}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-white/90 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Botón entendido */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-white text-blue-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
        >
          ¡Entendido! ✓
        </button>

        {/* Indicador de puntero (flecha) */}
        {position === 'top-right' && (
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-purple-600 transform rotate-45"></div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContextualTip;
