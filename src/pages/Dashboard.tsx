import React, { useState, useEffect } from 'react';
import { Filter, Plus, Camera } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ScanSection from '../components/ScanSection';
import RecipeModal from '../components/RecipeModal';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import OnboardingModal from '../components/OnboardingModal';
import ContextualTip from '../components/ContextualTip';
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
  const [confirmDialog, setConfirmDialog] = useState<{ 
    title: string; 
    message: string; 
    ingredient: string;
  } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDashboardTip, setShowDashboardTip] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
    
    // Verificar si debe mostrar onboarding
    const onboardingCompleted = user?.onboarding_completed;
    if (!onboardingCompleted) {
      // Pequeño delay para que cargue suavemente
      setTimeout(() => setShowOnboarding(true), 500);
    } else {
      // Si ya completó onboarding, mostrar tip del dashboard
      const dashboardTipShown = localStorage.getItem('dashboardTipShown');
      if (!dashboardTipShown) {
        setTimeout(() => setShowDashboardTip(true), 1000);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseDashboardTip = () => {
    setShowDashboardTip(false);
    localStorage.setItem('dashboardTipShown', 'true');
  };

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

  const handleCook = (ingredient: string) => {
    setConfirmDialog({
      title: 'Generar Receta',
      message: `¿Quieres generar una receta con ${ingredient}?`,
      ingredient
    });
  };

  const handleConfirmCook = async () => {
    if (!confirmDialog) return;
    
    const ingredient = confirmDialog.ingredient;
    setConfirmDialog(null);
    
    try {
      setIsGenerating(true);
      const generatedRecipes = await generateRecipeAI(ingredient, 3); // Generar 3 recetas
      
      // Mapear las recetas con la estructura correcta
      const mappedRecipes = generatedRecipes.map((r: any) => ({
        ...r,
        prepTime: r.time || r.prepTime || '30 min',
        ingredients: r.ingredients || [],
        instructions: r.instructions || []
      }));
      
      setRecipes(mappedRecipes);
      setToast({ message: '¡3 recetas generadas! Elige una para ver los detalles.', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error generando receta. Revisa que el Backend tenga la Key de Groq.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* ONBOARDING MODAL */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        userId={user?.id || ''}
      />

      {/* CONTEXTUAL TIP - DASHBOARD */}
      <ContextualTip
        isOpen={showDashboardTip}
        onClose={handleCloseDashboardTip}
        title="¡Escanea tu primera boleta! 📸"
        description="Usa el botón de arriba para tomar una foto de tu ticket del supermercado. La IA extraerá automáticamente todos los productos y los agregará a tu inventario."
        icon={<Camera className="w-6 h-6" />}
        position="top-right"
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
          <div className="flex gap-2">
            <button className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
              <Filter size={18}/>
            </button>
            <button className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">
              <Plus size={18}/>
            </button>
          </div>
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
              onCook={handleCook}
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
                  <p>⏱️ {r.time || r.prepTime}</p>
                  <p>👥 {r.servings} personas</p>
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

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={handleConfirmCook}
          onCancel={() => setConfirmDialog(null)}
          confirmText="Aceptar"
          cancelText="Cancelar"
          type="info"
        />
      )}
    </div>
  );
};

export default Dashboard;
