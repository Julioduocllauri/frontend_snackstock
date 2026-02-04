import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3, Calendar, Flame, Loader2, Sparkles, Award, Target } from 'lucide-react';
import { getStatistics, Statistics as StatsData } from '../services/statistics';
import Toast from '../components/Toast';
import ContextualTip from '../components/ContextualTip';

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [showStatisticsTip, setShowStatisticsTip] = useState(false);

  useEffect(() => {
    loadStatistics();
    
    const statisticsTipShown = localStorage.getItem('statisticsTipShown');
    if (!statisticsTipShown) {
      setTimeout(() => setShowStatisticsTip(true), 800);
    }
  }, []);

  const handleCloseStatisticsTip = () => {
    setShowStatisticsTip(false);
    localStorage.setItem('statisticsTipShown', 'true');
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await getStatistics();
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setToast({ message: 'Error al cargar estadísticas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
            <Sparkles className="w-8 h-8 text-purple-300 absolute top-0 right-0 animate-pulse" />
          </div>
          <p className="text-purple-200 text-lg">Analizando tus datos...</p>
        </div>
      </div>
    );
  }

  // Datos por defecto con todos los arrays necesarios
  const defaultStats = {
    user: {
      days_in_app: 0,
      total_consumed: 0,
      total_wasted: 0,
      total_added: 0
    },
    inventory: {
      total_products: 0,
      critical_products: 0,
      waste_rate: 0
    },
    calories: {
      today: 0,
      week: 0,
      month: 0,
      daily_average: 0
    },
    top_consumed: [],
    least_consumed: [],
    wasted_products: [],
    recommendations: []
  };

  const displayStats = stats || defaultStats;
  const hasData = stats !== null && stats.user?.total_consumed > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* CONTEXTUAL TIP */}
        <ContextualTip
          isOpen={showStatisticsTip}
          onClose={handleCloseStatisticsTip}
          title="¿Qué son las estadísticas? 📊"
          description="Aquí puedes ver cuántos productos tienes, cuántas calorías consumes al día, cuáles son tus productos favoritos y cuánto desperdicias. Usa esta información para mejorar tus hábitos de compra y alimentación."
          icon={<BarChart3 className="w-6 h-6" />}
          position="center"
        />

        {/* Header Futurista */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard de Estadísticas</h1>
                <p className="text-purple-200">Análisis inteligente de tus hábitos alimenticios</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-300">
              <Calendar className="w-4 h-4" />
              <span>Llevas {displayStats.user.days_in_app} días usando SnackStock</span>
              {hasData && <span className="ml-4">🎉 ¡Excelente trabajo!</span>}
            </div>
          </div>
        </div>

        {/* Alerta para usuarios nuevos */}
        {!hasData && (
          <div className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-white mb-1">¡Empieza tu viaje! 🚀</h3>
                <p className="text-purple-200">Agrega productos a tu inventario y márcalos como consumidos para desbloquear tus estadísticas personalizadas.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Diseño Futurista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1 - Total Productos */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-blue-400" />
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Inventario</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{displayStats.inventory.total_products}</p>
              <p className="text-sm text-purple-300">Productos activos</p>
              <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: hasData ? '75%' : '10%'}}></div>
              </div>
            </div>
          </div>

          {/* Card 2 - Críticos */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Alerta</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{displayStats.inventory.critical_products}</p>
              <p className="text-sm text-purple-300">Por vencer pronto</p>
              <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{width: displayStats.inventory.critical_products > 0 ? '60%' : '0%'}}></div>
              </div>
            </div>
          </div>

          {/* Card 3 - Calorías */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-4">
                <Flame className="w-8 h-8 text-orange-400" />
                <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">Energía</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{displayStats.calories.today}</p>
              <p className="text-sm text-purple-300">kcal hoy</p>
              <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full" style={{width: Math.min((displayStats.calories.today / 2000) * 100, 100) + '%'}}></div>
              </div>
            </div>
          </div>

          {/* Card 4 - Productos Salvados */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition"></div>
            <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-8 h-8 text-green-400" />
                <span className="text-xs font-bold text-green-300 uppercase tracking-wider">Salvados</span>
              </div>
              <p className="text-4xl font-bold text-white mb-2">{displayStats.user.total_consumed}</p>
              <p className="text-sm text-purple-300">Productos consumidos</p>
              <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{width: hasData ? '85%' : '5%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Calorías - Diseño Moderno */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Flame className="w-6 h-6 text-orange-300" />
              </div>
              <span className="text-sm font-bold text-orange-200 uppercase">Semana</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{displayStats.calories.week}</p>
            <p className="text-xs text-orange-200">kcal en 7 días</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-sm font-bold text-purple-200 uppercase">Mes</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{displayStats.calories.month}</p>
            <p className="text-xs text-purple-200">kcal en 30 días</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Target className="w-6 h-6 text-blue-300" />
              </div>
              <span className="text-sm font-bold text-blue-200 uppercase">Promedio</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{displayStats.calories.daily_average}</p>
            <p className="text-xs text-blue-200">kcal por día</p>
          </div>
        </div>

        {/* Top Products - Nuevo Diseño */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Más Consumidos */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Top Consumidos</h2>
              </div>
              <p className="text-green-100 text-sm mt-1">Tus productos favoritos</p>
            </div>
            
            <div className="p-6">
              {!hasData || displayStats.top_consumed.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Aún no hay datos de consumo</p>
                  <p className="text-slate-500 text-sm mt-1">Empieza a marcar productos como consumidos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayStats.top_consumed.slice(0, 5).map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{product.name}</h3>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">{product.times_consumed}x</p>
                        <p className="text-xs text-slate-400">{product.consumption_rate}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Menos Consumidos */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">Menos Usados</h2>
              </div>
              <p className="text-orange-100 text-sm mt-1">Considera dejar de comprarlos</p>
            </div>
            
            <div className="p-6">
              {!hasData || displayStats.least_consumed.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">¡Todos se consumen bien!</p>
                  <p className="text-slate-500 text-sm mt-1">Sigue así 🎉</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayStats.least_consumed.slice(0, 5).map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{product.product_name}</h3>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-400">{product.waste_rate}%</p>
                        <p className="text-xs text-slate-400">desperdicio</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resumen General */}
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            Resumen General
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {displayStats.user.total_added || 0}
              </p>
              <p className="text-sm text-slate-400">Agregados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {displayStats.user.total_consumed}
              </p>
              <p className="text-sm text-slate-400">Consumidos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {displayStats.user.total_wasted}
              </p>
              <p className="text-sm text-slate-400">Desperdiciados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {displayStats.inventory.waste_rate}%
              </p>
              <p className="text-sm text-slate-400">Tasa Desperdicio</p>
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Statistics;
