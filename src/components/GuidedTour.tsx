import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Camera, Package, ChefHat, BarChart3 } from 'lucide-react';

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      icon: <Camera className="w-12 h-12 text-green-500" />,
      title: '1. Escanea tus boletas 📸',
      description: 'Usa el botón "Escanear Boleta" en la parte superior del Dashboard para tomar una foto de tu ticket del supermercado.',
      tip: 'La IA detectará automáticamente todos los productos'
    },
    {
      icon: <Package className="w-12 h-12 text-purple-500" />,
      title: '2. Gestiona tu inventario 📦',
      description: 'Ve a la sección "Inventario" en el menú lateral para ver, editar y eliminar productos. Marca productos como consumidos.',
      tip: 'Recibe alertas de productos próximos a vencer'
    },
    {
      icon: <ChefHat className="w-12 h-12 text-orange-500" />,
      title: '3. Genera recetas 👨‍🍳',
      description: 'En "Recetas" la IA te sugerirá recetas deliciosas usando los ingredientes que ya tienes en tu despensa.',
      tip: 'Aprovecha productos antes de que venzan'
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-red-500" />,
      title: '4. Analiza tus estadísticas 📊',
      description: 'En "Estadísticas" revisa tu consumo, calorías, productos favoritos y patrones de alimentación.',
      tip: 'Reduce el desperdicio identificando qué no consumes'
    }
  ];

  const step = tourSteps[currentStep];

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
      {/* Modal centrado con el paso del tour */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-slideUp">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icono grande */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
            {step.icon}
          </div>
        </div>

        {/* Contenido */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h2>
          <p className="text-base text-gray-600 mb-6 leading-relaxed">{step.description}</p>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-700">
              💡 <span className="font-semibold">Tip:</span> {step.tip}
            </p>
          </div>
        </div>

        {/* Indicadores de progreso */}
        <div className="flex gap-2 mb-6">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index <= currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">
            {currentStep + 1} de {tourSteps.length}
          </span>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-lg"
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GuidedTour;
