
import React from 'react';
import { Recipe } from '../types';
import { X, Clock, ChefHat, Users } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isLoading, onClose }) => {
  if (!isLoading && !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-8 max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">✨ Creando algo delicioso... 🧠</p>
            </div>
          ) : recipe && (
            <div className="space-y-6">
              {/* Header con info principal */}
              <div className="text-center space-y-3 pb-4 border-b-2 border-slate-100">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-2">
                  <ChefHat size={16} /> Receta Recomendada
                </div>
                <h2 className="text-4xl font-bold text-slate-800 leading-tight">{recipe.title || 'Receta'}</h2>
                
                {/* Badges informativos */}
                <div className="flex items-center justify-center gap-4 text-sm pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <Clock size={16} className="text-blue-500" />
                    <span className="font-medium text-slate-700">{recipe.prepTime || recipe.time || '30 min'}</span>
                  </div>
                  {recipe.servings && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                      <Users size={16} className="text-purple-500" />
                      <span className="font-medium text-slate-700">{recipe.servings} porciones</span>
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className={`px-3 py-1.5 rounded-lg font-medium text-sm ${
                      recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' :
                      recipe.difficulty === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {recipe.difficulty}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-5 gap-8 pt-4">
                {/* Ingredientes */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-lg">🥘</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Ingredientes</h3>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <ul className="space-y-3">
                      {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ing, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-700">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-relaxed">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="md:col-span-3 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-lg">👨‍🍳</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Preparación</h3>
                  </div>
                  <ol className="space-y-4">
                    {(Array.isArray(recipe.instructions) ? recipe.instructions : []).map((step, idx) => (
                      <li key={idx} className="flex gap-4 group">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white text-sm font-bold shrink-0 shadow-md group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </span>
                        <div className="flex-1 pt-1">
                          <p className="text-slate-700 leading-relaxed">{step}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Footer con botón */}
              <div className="pt-6 flex justify-center border-t-2 border-slate-100">
                <button 
                  onClick={onClose}
                  className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  ¡Listo para cocinar! 🍽️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
