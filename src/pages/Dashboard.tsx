import React, { useState, useEffect } from 'react';
import { Filter, Plus, Camera } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ScanSection from '../components/ScanSection';
import RecipeModal from '../components/RecipeModal';
import Toast from '../components/Toast';
import OnboardingModal from '../components/OnboardingModal';
import ContextualTip from '../components/ContextualTip';
import TourGuide, { TourStep } from '../components/TourGuide';
import HelpButton from '../components/HelpButton';
import { useTour } from '../hooks/useTour';
import { getPantryItems, processReceipt, generateRecipeAI, Product } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [recipes, setRecipes] = useState<any[]>([]); // Para las 3 recetas generadas
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Tour guiado - Sin delay automático, se activará manualmente
  const { isActive: isTourActive, completeTour, skipTour, startTour } = useTour('dashboard-tour', 0);

  // Pasos del tour
  const tourSteps: TourStep[] = [
    {
      target: '#upload-button',
      title: 'Escanea tus boletas',
      description: 'Toma una foto de tu boleta del supermercado y nuestra IA detectará automáticamente todos los productos para agregarlos a tu despensa.',
      position: 'right'
    },
    {
      target: '#pantry-list',
      title: 'Gestiona tu inventario',
      description: 'Todos tus productos organizados en un solo lugar. Filtra por categoría, busca por nombre y recibe alertas cuando estén próximos a vencer.',
      position: 'bottom'
    }
  ];

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar onboarding y tooltips - SIMPLIFICADO
  useEffect(() => {
    if (!user) {
      console.log('No hay usuario todavía, esperando...');
      return;
    }

    console.log('=== DASHBOARD: Usuario cargado ===');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Onboarding completado:', user.onboarding_completed);
    console.log('Tipo de onboarding_completed:', typeof user.onboarding_completed);
    console.log('Estado actual showOnboarding:', showOnboarding);
    console.log('================================');

    // Si NO ha completado onboarding, mostrarlo
    if (user.onboarding_completed === false || user.onboarding_completed === undefined) {
      console.log(' Mostrando modal de onboarding...');
      setTimeout(() => {
        console.log(' Ejecutando setTimeout para mostrar onboarding');
        setShowOnboarding(true);
      }, 500);
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const data = await getPantryItems();
    setProducts(data);
    setLoading(false);
  };

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      await processReceipt(file);
      await loadData(); // Recargar lista
      setToast({ message: '¡Boleta procesada exitosamente!', type: 'success' });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Error al procesar. Intenta con una imagen más clara.', type: 'error' });
    } finally {
      setIsScanning(false);
    }
  };



  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* HELP BUTTON */}
      <HelpButton onRestartTour={startTour} tourKey="dashboard-tour" />

      {/* TOUR GUIDE */}
      <TourGuide
        steps={tourSteps}
        isActive={isTourActive && !showOnboarding}
        onComplete={completeTour}
        onSkip={skipTour}
        tourKey="dashboard-tour"
      />

      {/* ONBOARDING MODAL */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        userId={user?.id || ''}
      />

      {/* HERO SECTION - ESCÁNER */}
      <div id="scan-section">
        <ScanSection onScan={handleScan} isScanning={isScanning} />
      </div>

      {/* LISTA DE DESPENSA */}
      <section className="space-y-6" id="pantry-list">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Mi Despensa 
            <span className="text-sm font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-slate-400">
              No hay productos. ¡Escanea tu primera boleta!
            </div>
          )}

          {products.map((product) => (
            <ProductCard
              key={product.id || Math.random()}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN DE RECETAS GENERADAS */}
      {recipes.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Recetas Generadas - Elige una
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipes.map((r, idx) => (
              <div
                key={idx}
                onClick={() => setRecipe(r)}
                className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-slate-800 mb-2">{r.title}</h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p> {r.time || r.prepTime}</p>
                  <p> {r.servings} personas</p>
                  <p className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full inline-block text-xs font-semibold">
                    {r.difficulty}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setRecipes([])}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors"
          >
            Cerrar recetas
          </button>
        </section>
      )}

      {/* LOADING RECIPES */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Generando 3 recetas...</p>
          </div>
        </div>
      )}

      {/* MODAL DE RECETA */}
      {recipe && (
        <RecipeModal 
          recipe={recipe}
          isLoading={false}
          onClose={() => setRecipe(null)}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
