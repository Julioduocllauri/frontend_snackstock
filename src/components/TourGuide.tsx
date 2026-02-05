import React, { useEffect, useState, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Sparkles, MoveDown } from 'lucide-react';

export interface TourStep {
  target: string; // selector del elemento a destacar
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlightPadding?: number;
}

interface TourGuideProps {
  steps: TourStep[];
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
  tourKey: string; // identificador único del tour (ej: 'dashboard-tour')
}

const TourGuide: React.FC<TourGuideProps> = ({ steps, isActive, onComplete, onSkip, tourKey }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      const step = steps[currentStep];
      if (!step) return;

      const targetElement = document.querySelector(step.target);
      console.log(` Tour buscando: ${step.target}, encontrado:`, targetElement);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        console.log(` Dimensiones del elemento:`, rect);
        
        // Verificar que el elemento tenga dimensiones válidas
        if (rect.width === 0 || rect.height === 0) {
          console.warn(` Elemento ${step.target} tiene dimensiones 0, reintentando...`);
          setTimeout(updatePosition, 100);
          return;
        }
        
        // Redondear valores para mejor alineación
        const roundedRect = {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom)
        } as DOMRect;
        setTargetRect(roundedRect);
        
        // Hacer scroll si el elemento no está visible
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        console.warn(` Elemento ${step.target} no encontrado en el DOM`);
      }
    };

    // Esperar un poco antes de la primera actualización para asegurar que el DOM esté listo
    const initialTimeout = setTimeout(updatePosition, 100);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, steps, isActive]);

  if (!isActive || !steps.length) return null;

  const step = steps[currentStep];
  const padding = step.highlightPadding || 8; // Reducido a 8px para mejor ajuste

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(tourKey, 'completed');
    onComplete();
  };

  const handleSkipTour = () => {
    localStorage.setItem(tourKey, 'completed');
    onSkip();
  };

  // Calcular posición del tooltip - siempre centrado
  const getTooltipPosition = (): React.CSSProperties => {
    const isMobile = window.innerWidth < 768;
    const tooltipWidth = isMobile ? window.innerWidth - 32 : 500; // 16px padding en cada lado para móvil
    
    // Centrar horizontal y verticalmente
    const left = isMobile ? 16 : (window.innerWidth / 2) - (tooltipWidth / 2);
    const top = (window.innerHeight / 2) - 150; // Centrado vertical

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${tooltipWidth}px`,
      zIndex: 10002
    };
  };

  // Calcular posición de la flecha según la posición del tooltip
  const getArrowPosition = (): React.CSSProperties => {
    if (!targetRect) return {};

    const position = step.position || 'bottom';
    let top = 0;
    let left = targetRect.left + targetRect.width / 2 - 20;

    switch (position) {
      case 'top':
        // Flecha apunta hacia abajo (debajo del elemento)
        top = targetRect.bottom + 10;
        break;
      case 'bottom':
        // Flecha apunta hacia arriba (encima del elemento)
        top = targetRect.top - 50;
        break;
    }

    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10001,
      pointerEvents: 'none'
    };
  };

  return (
    <>
      {/* Overlay oscuro más suave */}
      <div 
        className="fixed inset-0 bg-black transition-opacity duration-300"
        style={{ 
          opacity: 0.3,
          zIndex: 10000,
          pointerEvents: 'none'
        }}
      />

      {/* Tooltip con información */}
      <div
        ref={tooltipRef}
        className="bg-white rounded-xl shadow-2xl animate-fadeIn"
        style={getTooltipPosition()}
      >
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
                <p className="text-xs text-gray-500">Paso {currentStep + 1} de {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkipTour}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Descripción */}
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {step.description}
          </p>

          {/* Barra de progreso */}
          <div className="flex gap-1 mb-4">
            {steps.map((_, index) => (
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
            <button
              onClick={handleSkipTour}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
            >
              Saltar guía
            </button>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Atrás
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors font-medium text-sm flex items-center gap-1"
              >
                {currentStep < steps.length - 1 ? (
                  <>
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Finalizar ✓
                  </>
                )}
              </button>
            </div>
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
        @keyframes pulse-border {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default TourGuide;
