import React, { useState, useEffect } from 'react';
import { Filter, Plus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ScanSection from '../components/ScanSection';
import RecipeModal from '../components/RecipeModal';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { getPantryItems, processReceipt, generateRecipeAI, Product } from '../services/api';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    title: string; 
    message: string; 
    ingredient: string;
  } | null>(null);

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

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
      const generatedRecipe = await generateRecipeAI(ingredient);
      setRecipe(generatedRecipe);
      setToast({ message: '¡Receta generada exitosamente!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error generando receta. Revisa que el Backend tenga la Key de Groq.', type: 'error' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* HERO SECTION - ESCÁNER */}
      <ScanSection onScan={handleScan} isScanning={isScanning} />

      {/* LISTA DE DESPENSA */}
      <section className="space-y-6">
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

      {/* MODAL DE RECETA */}
      {recipe && (
        <RecipeModal 
          recipe={recipe}
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
