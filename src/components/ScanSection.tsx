import React, { useRef } from 'react';
import { Camera, ShoppingBag, Upload } from 'lucide-react';

interface ScanSectionProps {
  onScan: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isScanning: boolean;
}

const ScanSection: React.FC<ScanSectionProps> = ({ onScan, isScanning }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  // Detectar si es dispositivo móvil
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <section id="scan-card" className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl shadow-blue-200">
      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Mantén tu despensa fresca.
        </h1>
        <p className="text-blue-100 text-lg mb-8">
          {isMobile 
            ? "Toma una foto de tu boleta o selecciona una imagen de tu galería."
            : "Escanea tus boletas para registrar tus compras automáticamente."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4" id="scan-buttons">
          {/* Botón de Cámara (solo móvil) */}
          {isMobile && (
            <>
              <button
                onClick={handleCameraClick}
                disabled={isScanning}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Camera size={22} />
                <span>Tomar Foto</span>
              </button>
              <input 
                ref={cameraInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                onChange={onScan} 
                disabled={isScanning} 
              />
            </>
          )}
          
          {/* Botón de Subir Archivo */}
          <button
            id="upload-button"
            onClick={handleFileClick}
            disabled={isScanning}
            className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Upload size={22} />
            <span>{isScanning ? "Analizando..." : isMobile ? "Galería" : "Subir Imagen"}</span>
          </button>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*,.pdf"
            className="hidden" 
            onChange={onScan} 
            disabled={isScanning} 
          />
        </div>
        
        {isScanning && (
          <div className="mt-4 flex items-center gap-2 text-blue-100">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Procesando imagen con IA...</span>
          </div>
        )}
      </div>
      
      {/* Decoración */}
      <ShoppingBag className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-blue-500 opacity-30 rotate-[-15deg]" />
    </section>
  );
};

export default ScanSection;
