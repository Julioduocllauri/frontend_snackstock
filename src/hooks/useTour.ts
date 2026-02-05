import { useState, useEffect } from 'react';

export const useTour = (tourKey: string, delay: number = 1000) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Verificar si el tour ya fue completado
    const tourCompleted = localStorage.getItem(tourKey);
    
    // Si delay es 0, no activar automáticamente (debe ser manual)
    if (!tourCompleted && delay > 0) {
      // Esperar un poco antes de mostrar el tour
      const timer = setTimeout(() => {
        setIsActive(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [tourKey, delay]);

  const startTour = () => {
    const tourCompleted = localStorage.getItem(tourKey);
    console.log(`🔍 startTour llamado para ${tourKey}, completado:`, tourCompleted);
    // Solo iniciar si no ha sido completado
    if (!tourCompleted) {
      console.log(`✅ Activando tour ${tourKey}`);
      setIsActive(true);
    } else {
      console.log(`⏭️ Tour ${tourKey} ya fue completado, no se muestra`);
    }
  };

  const completeTour = () => {
    setIsActive(false);
    localStorage.setItem(tourKey, 'completed');
  };

  const skipTour = () => {
    setIsActive(false);
    localStorage.setItem(tourKey, 'completed');
  };

  const resetTour = () => {
    localStorage.removeItem(tourKey);
    setIsActive(true);
  };

  return {
    isActive,
    startTour,
    completeTour,
    skipTour,
    resetTour
  };
};
