import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Sparkles, Search, Heart, Loader2, X } from 'lucide-react';
import { getPantryItems, generateRecipeAI, recordConsumption, deleteProduct } from '../services/api';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import ContextualTip from '../components/ContextualTip';
import TourGuide, { TourStep } from '../components/TourGuide';
import HelpButton from '../components/HelpButton';
import RecipeModal from '../components/RecipeModal';
import { useTour } from '../hooks/useTour';
import { Recipe } from '../types';
import { useAuth } from '../context/AuthContext';

interface Product {
  id: number;
  name: string;
  days_left: number;
  category?: string;
}

const Recipes: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [criticalProducts, setCriticalProducts] = useState<Product[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]); // Ahora es array
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    title: string; 
    message: string; 
    ingredients: string[];
  } | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipesTip, setShowRecipesTip] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState<Map<number, string[]>>(new Map()); // Mapa de receta ID -> ingredientes usados

  // Tour guiado - Se activa automáticamente si no se ha mostrado
  const { isActive: isTourActive, completeTour, skipTour, startTour } = useTour('recipes-tour', 0);

  // Pasos del tour
  const tourSteps: TourStep[] = [
    {
      target: '#critical-products',
      title: 'Productos próximos a vencer',
      description: 'Aquí verás tus productos que están por vencer (menos de 7 días). Úsalos en recetas para evitar desperdicios.',
      position: 'bottom'
    },
    {
      target: '#ingredient-selection',
      title: 'Selecciona ingredientes',
      description: 'Haz clic en los ingredientes que quieras usar en tus recetas. Puedes seleccionar varios a la vez.',
      position: 'bottom'
    },
    {
      target: '#generate-button',
      title: 'Generar recetas',
      description: 'Presiona el botón para que la IA te sugiera 3 recetas deliciosas usando los ingredientes seleccionados.',
      position: 'left'
    }
  ];

  useEffect(() => {
    loadCriticalProducts();
    
    // Limpiar recetas antiguas sin userId (sistema antiguo)
    localStorage.removeItem('savedRecipes');
    localStorage.removeItem('recipeIngredients');
    localStorage.removeItem('recipesTipShown');
    
    // Solo cargar recetas si hay un usuario autenticado
    if (!user?.id) {
      setRecipes([]);
      setRecipeIngredients(new Map());
      return;
    }
    
    // Cargar recetas guardadas desde localStorage (específicas del usuario)
    const savedRecipes = localStorage.getItem(`savedRecipes_${user.id}`);
    const savedRecipeIngredients = localStorage.getItem(`recipeIngredients_${user.id}`);
    
    if (savedRecipes) {
      try {
        const parsedRecipes = JSON.parse(savedRecipes);
        setRecipes(parsedRecipes);
      } catch (error) {
        console.error('Error al cargar recetas guardadas:', error);
        setRecipes([]);
      }
    } else {
      setRecipes([]);
    }
    
    if (savedRecipeIngredients) {
      try {
        const parsedMap = JSON.parse(savedRecipeIngredients);
        setRecipeIngredients(new Map(Object.entries(parsedMap).map(([k, v]) => [Number(k), v as string[]])));
      } catch (error) {
        console.error('Error al cargar ingredientes de recetas:', error);
        setRecipeIngredients(new Map());
      }
    } else {
      setRecipeIngredients(new Map());
    }
    
    // Mostrar tip de recetas en la primera visita (específico del usuario)
    const recipesTipShown = localStorage.getItem(`recipesTipShown_${user.id}`);
    if (!recipesTipShown) {
      setTimeout(() => setShowRecipesTip(true), 800);
    }
  }, [user]);

  const handleCloseRecipesTip = () => {
    setShowRecipesTip(false);
    if (user?.id) {
      localStorage.setItem(`recipesTipShown_${user.id}`, 'true');
    }
  };

  // Guardar recetas en localStorage cuando cambien (específicas del usuario)
  useEffect(() => {
    if (recipes.length > 0 && user?.id) {
      localStorage.setItem(`savedRecipes_${user.id}`, JSON.stringify(recipes));
    }
  }, [recipes, user]);

  // Guardar mapa de ingredientes en localStorage cuando cambie (específico del usuario)
  useEffect(() => {
    if (recipeIngredients.size > 0 && user?.id) {
      const obj = Object.fromEntries(recipeIngredients);
      localStorage.setItem(`recipeIngredients_${user.id}`, JSON.stringify(obj));
    }
  }, [recipeIngredients, user]);

  const loadCriticalProducts = async () => {
    try {
      setLoading(true);
      const products = await getPantryItems();
      // Filtrar productos próximos a vencer (menos de 7 días)
      const critical = products.filter((p: any) => p.days_left <= 7);
      setCriticalProducts(critical);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setToast({ message: 'Error al cargar productos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const consumeIngredientsFromInventory = async (ingredientNames: string[]) => {
    try {
      // Obtener todos los productos para encontrar IDs y categorías
      const allProducts = await getPantryItems();
      
      // Filtrar productos que coincidan con los ingredientes usados
      const usedProducts = allProducts.filter(p => 
        ingredientNames.some(ing => ing.toLowerCase() === p.name.toLowerCase())
      );
      
      // Registrar consumo en estadísticas y eliminar del inventario
      for (const product of usedProducts) {
        // 1. Registrar en historial de consumo (para estadísticas)
        await recordConsumption(product.name, product.category, 1, undefined, 'consumed');
        
        // 2. Eliminar del inventario
        await deleteProduct(product.id!);
      }
      
      // Recargar productos críticos para actualizar la vista
      await loadCriticalProducts();
      
    } catch (error) {
      console.error('Error al consumir ingredientes:', error);
      // No mostramos error al usuario para no interrumpir la experiencia
    }
  };

  const handleIngredientClick = (ingredient: string) => {
    // Toggle: agregar o quitar ingrediente
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const handleGenerateRecipes = () => {
    if (selectedIngredients.length === 0) {
      setToast({ message: 'Selecciona al menos un ingrediente', type: 'warning' });
      return;
    }

    setConfirmDialog({
      title: 'Generar Recetas',
      message: `¿Quieres generar recetas con: ${selectedIngredients.join(', ')}?`,
      ingredients: selectedIngredients
    });
  };

  const handleGenerateRecipe = async () => {
    if (!confirmDialog) return;
    
    const ingredients = confirmDialog.ingredients;
    setConfirmDialog(null);
    
    try {
      setGenerating(true);
      const data = await generateRecipeAI(ingredients, 3); // Generar 3 recetas
      
      if (data && Array.isArray(data)) {
        // Convertir las 3 recetas de Groq al formato de la UI
        const newRecipes: Recipe[] = data.map((recipe, index) => ({
          id: Date.now() + index,
          title: recipe.title || `Receta ${index + 1}`,
          mainIngredient: ingredients[0],
          time: recipe.time,
          prepTime: recipe.time || '30 min',
          servings: recipe.servings || 4,
          difficulty: recipe.difficulty || 'Media',
          saved: false,
          instructions: recipe.instructions,
          ingredients: recipe.ingredients
        }));
        
        // Guardar qué ingredientes se usaron para cada receta
        const newMap = new Map(recipeIngredients);
        newRecipes.forEach(recipe => {
          if (recipe.id) {
            newMap.set(recipe.id, ingredients);
          }
        });
        setRecipeIngredients(newMap);
        
        setRecipes([...newRecipes, ...recipes]);
        setSelectedIngredients([]);
        
        setToast({ message: `¡${newRecipes.length} recetas generadas exitosamente!`, type: 'success' });
      }
    } catch (error) {
      console.error('Error generando receta:', error);
      setToast({ message: 'Error al generar receta. Por favor intenta de nuevo.', type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const toggleSave = (recipeId: number) => {
    const updatedRecipes = recipes.map(r => 
      r.id === recipeId ? { ...r, saved: !r.saved } : r
    );
    setRecipes(updatedRecipes);
    
    // Si el modal está abierto con esta receta, actualizarlo también
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe({ ...selectedRecipe, saved: !selectedRecipe.saved });
    }
    
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setToast({ 
        message: !recipe.saved ? 'Receta guardada' : 'Receta removida de guardados', 
        type: 'success' 
      });
    }
  };

  const handleRecipeComplete = async (ingredientsUsed: string[]) => {
    try {
      // Registrar consumo y eliminar productos del inventario
      await consumeIngredientsFromInventory(ingredientsUsed);
      setToast({ message: '¡Receta completada! Productos consumidos del inventario', type: 'success' });
    } catch (error) {
      console.error('Error al consumir ingredientes:', error);
      setToast({ message: 'Error al actualizar inventario', type: 'error' });
    }
  };

  const filteredRecipes = recipes?.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (recipe.mainIngredient && recipe.mainIngredient.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-600';
      case 'Media': return 'bg-yellow-100 text-yellow-600';
      case 'Difícil': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* HELP BUTTON */}
      <HelpButton onRestartTour={startTour} tourKey="recipes-tour" />

      {/* TOUR GUIDE */}
      <TourGuide
        steps={tourSteps}
        isActive={isTourActive && criticalProducts.length > 0}
        onComplete={completeTour}
        onSkip={skipTour}
        tourKey="recipes-tour"
      />

      {/* CONTEXTUAL TIP - RECETAS */}
      <ContextualTip
        isOpen={showRecipesTip}
        onClose={handleCloseRecipesTip}
        title="¿Cómo generar recetas? 👨‍🍳"
        description="Esta sección te muestra productos que están próximos a vencer. ¡No los desperdicies! Selecciona los ingredientes que quieras usar (haz clic sobre ellos) y presiona 'Generar Recetas'. La IA creará 3 recetas deliciosas para ti."
        icon={<ChefHat className="w-6 h-6" />}
        position="center"
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <ChefHat className="text-orange-500" size={32} />
          Mis Recetas
        </h1>
        <p className="text-slate-500">Recetas generadas con tus ingredientes próximos a vencer</p>
      </div>

      {/* Generador de Recetas con IA */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white shadow-lg" id="critical-products">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Generar Receta con IA</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Cargando ingredientes...</span>
          </div>
        ) : criticalProducts.length > 0 ? (
          <div>
            <p className="mb-3 text-purple-100">
              Tienes {criticalProducts.length} productos próximos a vencer. Selecciona uno o más para generar recetas:
            </p>
            <div className="flex flex-wrap gap-2 mb-4" id="ingredient-selection">
              {criticalProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleIngredientClick(product.name)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedIngredients.includes(product.name)
                      ? 'bg-white text-purple-600 font-semibold ring-2 ring-white'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {product.name} ({product.days_left}d)
                </button>
              ))}
            </div>
            
            {selectedIngredients.length > 0 && (
              <div className="bg-white/20 rounded-lg p-3 mb-3">
                <p className="text-sm font-semibold mb-2">Ingredientes seleccionados:</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedIngredients.map((ing, idx) => (
                    <span key={idx} className="bg-white/30 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {ing}
                      <button onClick={() => handleIngredientClick(ing)} className="hover:bg-white/20 rounded-full p-1">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  id="generate-button"
                  onClick={handleGenerateRecipes}
                  disabled={generating}
                  className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando 3 recetas con IA...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generar 3 Recetas
                    </>
                  )}
                </button>
              </div>
            )}
            
            {selectedIngredients.length === 0 && (
              <div className="text-sm text-purple-100">
                💡 Tip: Puedes seleccionar varios ingredientes para recetas más completas
              </div>
            )}
          </div>
        ) : (
          <p className="text-purple-100">
            No hay productos próximos a vencer. ¡Todo está fresco!
          </p>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar recetas..."
            className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Recetas Guardadas</p>
              <p className="text-3xl font-bold">{recipes?.filter(r => r.saved).length || 0}</p>
            </div>
            <Heart className="text-white/30" size={40} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Recetas Totales</p>
              <p className="text-3xl font-bold">{recipes?.length || 0}</p>
            </div>
            <ChefHat className="text-white/30" size={40} />
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400">
            <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No hay recetas generadas aún</p>
            <p className="text-sm">Selecciona un ingrediente arriba para generar una receta con IA</p>
          </div>
        )}

        {filteredRecipes.map((recipe) => (
          <div 
            key={recipe.id} 
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all group"
          >
            {/* Recipe Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-sm text-slate-500">
                  Ingrediente principal: <span className="font-medium text-slate-700">{recipe.mainIngredient}</span>
                </p>
              </div>
              <button 
                onClick={() => toggleSave(recipe.id)}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Heart className={recipe.saved ? 'fill-red-500 text-red-500' : 'text-slate-400'} size={20} />
              </button>
            </div>

            {/* Recipe Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock size={16} />
                <span>{recipe.prepTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={16} />
                <span>{recipe.servings} porciones</span>
              </div>
            </div>

            {/* Recipe Instructions Preview */}
            {recipe.instructions && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700 line-clamp-3">{recipe.instructions}</p>
              </div>
            )}

            {/* Difficulty Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
              <button 
                onClick={() => setSelectedRecipe(recipe)}
                className="text-sm text-purple-600 font-medium hover:text-purple-700"
              >
                Ver receta completa →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      <RecipeModal 
        recipe={selectedRecipe}
        isLoading={false}
        onClose={() => setSelectedRecipe(null)}
        usedIngredients={selectedRecipe?.id ? recipeIngredients.get(selectedRecipe.id) : []}
        onComplete={handleRecipeComplete}
      />

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
          onConfirm={handleGenerateRecipe}
          onCancel={() => {
            setConfirmDialog(null);
            setSelectedIngredients([]);
          }}
          confirmText="Generar"
          cancelText="Cancelar"
          type="info"
        />
      )}
    </div>
  );
};

export default Recipes;
