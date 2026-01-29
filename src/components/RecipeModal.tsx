
import React from 'react';
import { Recipe } from '../types';
import { X, Clock, ChefHat } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isLoading, onClose }) => {
  if (!isLoading && !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="relative p-8 max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
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
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold uppercase tracking-wider mb-2">
                  <ChefHat size={14} /> Receta Recomendada
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{recipe.title}</h2>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <Clock size={16} />
                  <span>Listo en {recipe.prepTime}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Ingredientes</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Preparación</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex gap-4 group">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {idx + 1}
                        </span>
                        <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="pt-8 flex justify-center">
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-blue-200"
                >
                  ¡A disfrutar!
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
