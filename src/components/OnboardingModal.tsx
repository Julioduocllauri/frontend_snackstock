import React, { useState } from 'react';
import { X, Package, Camera, ChefHat, BarChart3, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, userId }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: (
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
          <Sparkles className="w-16 h-16 text-white" strokeWidth={2.5} />
        </div>
      ),
      title: "¡Bienvenido a SnackStock!",
      description: "La app inteligente que te ayuda a gestionar tu despensa, evitar desperdicios y aprovechar al máximo tus alimentos.",
      tip: "Nunca más olvides lo que tienes en casa"
    },
    {
      icon: (
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
          <Camera className="w-16 h-16 text-white" strokeWidth={2.5} />
        </div>
      ),
      title: "Escanea tus Boletas",
      description: "Solo toma una foto de tu boleta del supermercado y nuestra IA extraerá todos los productos automáticamente.",
      tip: "Ahorra tiempo registrando múltiples productos a la vez"
    },
    {
      icon: (
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
          <Package className="w-16 h-16 text-white" strokeWidth={2.5} />
        </div>
      ),
      title: "Gestiona tu Inventario",
      description: "Ve todos tus productos en un solo lugar. Filtra por categoría, fecha de vencimiento y recibe alertas de productos por vencer.",
      tip: "Marca productos como consumidos o desperdiciados para mejorar tus estadísticas"
    },
    {
      icon: (
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
          <ChefHat className="w-16 h-16 text-white" strokeWidth={2.5} />
        </div>
      ),
      title: "Genera Recetas",
      description: "¿No sabes qué cocinar? Nuestra IA te sugiere recetas deliciosas usando los ingredientes que ya tienes.",
      tip: "Aprovecha productos próximos a vencer en recetas creativas"
    },
    {
      icon: (
        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
          <BarChart3 className="w-16 h-16 text-white" strokeWidth={2.5} />
        </div>
      ),
      title: "Analiza tus Hábitos",
      description: "Revisa tus estadísticas de consumo, calorías, productos favoritos y descubre patrones en tu alimentación.",
      tip: "Reduce el desperdicio identificando productos que no consumes"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleComplete = async () => {
    await completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      console.log('Completando onboarding para usuario:', userId);
      await axios.post(`${API_URL}/auth/complete-onboarding/${userId}`);
      console.log('Onboarding completado exitosamente');
      onClose();
    } catch (error) {
      console.error('Error completando onboarding:', error);
      onClose(); // Cerrar de todas formas
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative animate-fadeIn">
        {/* Botón cerrar */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Indicadores de progreso */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Contenido */}
        <div className="text-center mb-8">
          {step.icon}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{step.title}</h2>
          <p className="text-lg text-gray-600 mb-6">{step.description}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-blue-700">
              💡 <span className="font-semibold">Tip:</span> {step.tip}
            </p>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
          >
            Saltar tutorial
          </button>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Anterior
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Siguiente <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                '¡Comenzar! 🚀'
              )}
            </button>
          </div>
        </div>

        {/* Contador */}
        <div className="text-center mt-6 text-sm text-gray-400">
          {currentStep + 1} de {steps.length}
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
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OnboardingModal;
