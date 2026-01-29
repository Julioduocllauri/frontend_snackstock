import React from 'react';
import { Camera, ShoppingBag } from 'lucide-react';

interface ScanSectionProps {
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isScanning: boolean;
}

const ScanSection: React.FC<ScanSectionProps> = ({ onScan, isScanning }) => {
  // Detectar si es dispositivo móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return (
    <section className="relative overflow-hidden bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-blue-200">
      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Mantén tu despensa fresca.
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          Escanea tus boletas para registrar tus compras automáticamente.
        </p>
        
        <label className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl cursor-pointer hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95">
          <Camera size={22} />
          <span>{isScanning ? "Analizando..." : "Escanear Boleta"}</span>
          <input 
            type="file" 
            accept="image/*" 
            capture={isMobile ? "environment" : undefined}
            className="hidden" 
            onChange={onScan} 
            disabled={isScanning} 
          />
        </label>
      </div>
      
      {/* Decoración */}
      <ShoppingBag className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-blue-500 opacity-50 rotate-[-15deg]" />
    </section>
  );
};

export default ScanSection;
