import { useState, useEffect } from 'react';

export const useTour = (tourKey: string, delay: number = 1000) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Verificar si el tour ya fue completado
    const tourCompleted = localStorage.getItem(tourKey);
    
    if (!tourCompleted) {
      // Esperar un poco antes de mostrar el tour
      const timer = setTimeout(() => {
        setIsActive(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [tourKey, delay]);

  const startTour = () => {
    setIsActive(true);
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
