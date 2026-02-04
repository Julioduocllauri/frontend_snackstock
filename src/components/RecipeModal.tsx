
import React, { useState } from 'react';
import { Recipe } from '../types';
import { X, Clock, ChefHat, Users, CheckCircle2 } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isLoading, onClose }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isLoading && !recipe) return null;

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Dividir pasos en fases
  const groupInstructions = (instructions: string[]) => {
    const third = Math.ceil(instructions.length / 3);
    return {
      preparacion: instructions.slice(0, third),
      coccion: instructions.slice(third, third * 2),
      finalizacion: instructions.slice(third * 2)
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
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
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border-2 border-blue-100">
                    <ul className="space-y-3">
                      {(Array.isArray(recipe.ingredients) ? recipe.ingredients : []).map((ing, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-800 hover:bg-white/50 p-2 rounded-lg transition">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-relaxed font-medium">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Instrucciones con fases */}
                <div className="md:col-span-3 space-y-6">
                  {(() => {
                    const instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [];
                    const grouped = groupInstructions(instructions);
                    let globalIndex = 0;
                    
                    return (
                      <>
                        {/* Fase 1: Preparación */}
                        {grouped.preparacion.length > 0 && (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <span className="text-white text-lg">🔪</span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-800">Fase 1: Preparación</h4>
                            </div>
                            <ol className="space-y-3">
                              {grouped.preparacion.map((step) => {
                                const idx = globalIndex++;
                                const isCompleted = completedSteps.includes(idx);
                                return (
                                  <li key={idx} 
                                    onClick={() => toggleStep(idx)}
                                    className={`flex gap-3 cursor-pointer group hover:bg-white/50 p-3 rounded-xl transition ${isCompleted ? 'opacity-60' : ''}`}
                                  >
                                    <button className="shrink-0 mt-1">
                                      <CheckCircle2 
                                        size={20} 
                                        className={`transition-colors ${isCompleted ? 'text-green-600 fill-green-600' : 'text-slate-300'}`}
                                      />
                                    </button>
                                    <span className={`text-slate-700 leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                                      {step}
                                    </span>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        )}

                        {/* Fase 2: Cocción */}
                        {grouped.coccion.length > 0 && (
                          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-200">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <span className="text-white text-lg">🔥</span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-800">Fase 2: Cocción</h4>
                            </div>
                            <ol className="space-y-3">
                              {grouped.coccion.map((step) => {
                                const idx = globalIndex++;
                                const isCompleted = completedSteps.includes(idx);
                                return (
                                  <li key={idx}
                                    onClick={() => toggleStep(idx)}
                                    className={`flex gap-3 cursor-pointer group hover:bg-white/50 p-3 rounded-xl transition ${isCompleted ? 'opacity-60' : ''}`}
                                  >
                                    <button className="shrink-0 mt-1">
                                      <CheckCircle2 
                                        size={20} 
                                        className={`transition-colors ${isCompleted ? 'text-orange-600 fill-orange-600' : 'text-slate-300'}`}
                                      />
                                    </button>
                                    <span className={`text-slate-700 leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                                      {step}
                                    </span>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        )}

                        {/* Fase 3: Finalización */}
                        {grouped.finalizacion.length > 0 && (
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <span className="text-white text-lg">✨</span>
                              </div>
                              <h4 className="text-lg font-bold text-slate-800">Fase 3: Finalización</h4>
                            </div>
                            <ol className="space-y-3">
                              {grouped.finalizacion.map((step) => {
                                const idx = globalIndex++;
                                const isCompleted = completedSteps.includes(idx);
                                return (
                                  <li key={idx}
                                    onClick={() => toggleStep(idx)}
                                    className={`flex gap-3 cursor-pointer group hover:bg-white/50 p-3 rounded-xl transition ${isCompleted ? 'opacity-60' : ''}`}
                                  >
                                    <button className="shrink-0 mt-1">
                                      <CheckCircle2 
                                        size={20} 
                                        className={`transition-colors ${isCompleted ? 'text-purple-600 fill-purple-600' : 'text-slate-300'}`}
                                      />
                                    </button>
                                    <span className={`text-slate-700 leading-relaxed ${isCompleted ? 'line-through' : ''}`}>
                                      {step}
                                    </span>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Progress bar y Footer */}
              <div className="pt-6 space-y-4 border-t-2 border-slate-100">
                {/* Barra de progreso */}
                {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
                  <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-orange-500 to-purple-500 transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(completedSteps.length / recipe.instructions.length) * 100}%` 
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    {completedSteps.length > 0 ? (
                      <span className="font-medium">
                        🎉 {completedSteps.length} de {Array.isArray(recipe.instructions) ? recipe.instructions.length : 0} pasos completados
                      </span>
                    ) : (
                      <span className="text-slate-400">Haz clic en cada paso para marcarlo como completado</span>
                    )}
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {completedSteps.length === (Array.isArray(recipe.instructions) ? recipe.instructions.length : 0) && completedSteps.length > 0
                      ? '¡Buen provecho! 🍽️'
                      : 'Cerrar'
                    }
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
