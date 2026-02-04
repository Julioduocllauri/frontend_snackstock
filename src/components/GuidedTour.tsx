import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TourStep {
  target: string; // ID del elemento a resaltar
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [elementPosition, setElementPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    if (isOpen) {
      console.log('GuidedTour montado y visible');
    }
  }, [isOpen]);

  const tourSteps: TourStep[] = [
    {
      target: 'scan-section',
      title: '1. Escanea tu boleta aquí 📸',
      description: 'Haz clic en "Escanear Boleta" y toma una foto de tu ticket del supermercado. La IA detectará automáticamente todos los productos.',
      position: 'bottom'
    },
    {
      target: 'pantry-list',
      title: '2. Aquí aparecen tus productos 📦',
      description: 'Todos los productos escaneados se mostrarán aquí. Verás su nombre, cantidad y fecha de vencimiento.',
      position: 'top'
    },
    {
      target: 'nav-inventory',
      title: '3. Gestiona tu inventario 📋',
      description: 'En la sección Inventario puedes ver, editar y eliminar productos. También puedes marcarlos como consumidos.',
      position: 'bottom'
    },
    {
      target: 'nav-recipes',
      title: '4. Genera recetas inteligentes 👨‍🍳',
      description: 'La IA te sugerirá recetas basadas en los productos que tienes. ¡Perfecto para usar ingredientes antes de que venzan!',
      position: 'bottom'
    },
    {
      target: 'nav-statistics',
      title: '5. Analiza tus estadísticas 📊',
      description: 'Ve cuánto consumes, tus productos favoritos, calorías y patrones de alimentación.',
      position: 'bottom'
    }
  ];

  const step = tourSteps[currentStep];

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const element = document.getElementById(step.target);
      console.log('Buscando elemento:', step.target, 'Encontrado:', element);
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log('Posición del elemento:', rect);
        setElementPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
      } else {
        console.warn('Elemento no encontrado:', step.target);
      }
    };

    // Dar tiempo para que el DOM se renderice
    setTimeout(updatePosition, 100);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isOpen, step.target]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  const getTooltipPosition = () => {
    const padding = 20;
    const windowWidth = window.innerWidth;
    const tooltipWidth = 384; // max-w-md = 28rem = 448px aprox
    
    // Para elementos del sidebar (navegación), mostrar tooltip a la derecha
    const isNavElement = step.target.startsWith('nav-');
    
    if (isNavElement || step.position === 'right') {
      return {
        top: elementPosition.top + elementPosition.height / 2,
        left: Math.min(elementPosition.left + elementPosition.width + padding, windowWidth - tooltipWidth - 20),
        transform: 'translateY(-50%)'
      };
    }
    
    switch (step.position) {
      case 'bottom':
        return {
          top: elementPosition.top + elementPosition.height + padding,
          left: Math.max(Math.min(elementPosition.left + elementPosition.width / 2, windowWidth - tooltipWidth / 2 - 20), tooltipWidth / 2 + 20),
          transform: 'translateX(-50%)'
        };
      case 'top':
        return {
          top: elementPosition.top - padding,
          left: Math.max(Math.min(elementPosition.left + elementPosition.width / 2, windowWidth - tooltipWidth / 2 - 20), tooltipWidth / 2 + 20),
          transform: 'translate(-50%, -100%)'
        };
      case 'left':
        return {
          top: elementPosition.top + elementPosition.height / 2,
          left: Math.max(elementPosition.left - padding - tooltipWidth, 20),
          transform: 'translateY(-50%)'
        };
      default:
        return {
          top: elementPosition.top + elementPosition.height + padding,
          left: Math.max(Math.min(elementPosition.left + elementPosition.width / 2, windowWidth - tooltipWidth / 2 - 20), tooltipWidth / 2 + 20),
          transform: 'translateX(-50%)'
        };
    }
  };

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] transition-opacity" onClick={onClose} />
      
      {/* Spotlight - resalta el elemento */}
      <div
        className="fixed z-[101] pointer-events-none transition-all duration-300"
        style={{
          top: elementPosition.top - 8,
          left: elementPosition.left - 8,
          width: elementPosition.width + 16,
          height: elementPosition.height + 16,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6), 0 0 40px rgba(59, 130, 246, 0.5)',
          borderRadius: '12px',
          border: '3px solid #3b82f6'
        }}
      />

      {/* Tooltip con instrucciones */}
      <div
        className="fixed z-[102] bg-white rounded-2xl shadow-2xl p-6 max-w-md animate-fadeIn"
        style={getTooltipPosition()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-800 mb-3 pr-6">{step.title}</h3>
        <p className="text-gray-600 mb-6">{step.description}</p>

        {/* Indicadores de progreso */}
        <div className="flex gap-1.5 mb-4">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {currentStep + 1} de {tourSteps.length}
          </span>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-1"
            >
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Siguiente <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                '¡Entendido! ✓'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default GuidedTour;
