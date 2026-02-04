import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3, Calendar, Flame, Loader2 } from 'lucide-react';
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
    
    // Mostrar tip de estadísticas en la primera visita
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <p className="text-yellow-800">No hay datos suficientes para mostrar estadísticas.</p>
          <p className="text-yellow-600 text-sm mt-2">Comienza agregando productos y consumiéndolos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* CONTEXTUAL TIP - ESTADÍSTICAS */}
      <ContextualTip
        isOpen={showStatisticsTip}
        onClose={handleCloseStatisticsTip}
        title="¡Analiza tus hábitos! 📊"
        description="Descubre cuántas calorías consumes, tus productos favoritos y cuánto desperdicias. Mejora tus hábitos alimenticios con datos reales."
        icon={<BarChart3 className="w-6 h-6" />}
        position="center"
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <BarChart3 className="text-blue-500" size={32} />
          Estadísticas de Consumo
        </h1>
        <p className="text-slate-500">Analiza tus patrones de consumo y optimiza tu despensa</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
          <Calendar size={16} />
          <span>Llevas {stats.user.days_in_app} días usando SnackStock</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-500" size={24} />
            <span className="text-xs font-medium text-slate-500 uppercase">Total Productos</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.inventory.total_products}</p>
          <p className="text-sm text-slate-500 mt-1">En inventario</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="text-red-500" size={24} />
            <span className="text-xs font-medium text-slate-500 uppercase">Críticos</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.inventory.critical_products}</p>
          <p className="text-sm text-slate-500 mt-1">Por vencer pronto</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Flame className="text-orange-500" size={24} />
            <span className="text-xs font-medium text-slate-500 uppercase">Calorías Hoy</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.calories.today}</p>
          <p className="text-sm text-slate-500 mt-1">kcal consumidas</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-white" size={24} />
            <span className="text-xs font-medium text-green-100 uppercase">Salvados</span>
          </div>
          <p className="text-3xl font-bold">{stats.user.total_consumed}</p>
          <p className="text-sm text-green-100 mt-1">Productos consumidos</p>
        </div>
      </div>

      {/* Calorías Detalle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-orange-600" size={20} />
            <span className="text-sm font-semibold text-orange-800">Calorías Semanales</span>
          </div>
          <p className="text-2xl font-bold text-orange-900">{stats.calories.week} kcal</p>
          <p className="text-xs text-orange-700 mt-1">Últimos 7 días</p>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="text-purple-600" size={20} />
            <span className="text-sm font-semibold text-purple-800">Calorías Mensuales</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{stats.calories.month} kcal</p>
          <p className="text-xs text-purple-700 mt-1">Últimos 30 días</p>
        </div>

        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-blue-800">Promedio Diario</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.calories.daily_average} kcal</p>
          <p className="text-xs text-blue-700 mt-1">Por día este mes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Consumed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={24} />
              Más Consumidos
            </h2>
            <p className="text-green-100 text-sm mt-1">Productos que más compras y usas</p>
          </div>
          
          <div className="p-6 space-y-4">
            {stats.top_consumed.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No hay datos de consumo aún</p>
            ) : (
              stats.top_consumed.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <p className="text-xs text-slate-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{product.consumption_rate}%</p>
                        <p className="text-xs text-slate-500">{product.times_consumed} veces</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${product.consumption_rate}%` }}
                      />
                    </div>
                    {product.total_calories > 0 && (
                      <p className="text-xs text-slate-500 mt-1">🔥 {product.total_calories} kcal</p>
                    )}
                  </div>
                  <TrendingUp className="text-green-500" size={20} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Least Consumed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingDown size={24} />
              Menos Consumidos
            </h2>
            <p className="text-orange-100 text-sm mt-1">Productos que raramente usas</p>
          </div>
          
          <div className="p-6 space-y-4">
            {stats.least_consumed.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Todos los productos se consumen bien</p>
            ) : (
              stats.least_consumed.map((product, index) => (
                <div key={product.product_name} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-slate-800">{product.product_name}</h3>
                        <p className="text-xs text-slate-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">{product.consumption_rate}%</p>
                        <p className="text-xs text-slate-500">{product.times_consumed} veces</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
                        style={{ width: `${product.consumption_rate}%` }}
                      />
                    </div>
                  </div>
                  <TrendingDown className="text-red-500" size={20} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Wasted Products */}
      {stats.wasted_products.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            ⚠️ Productos Desperdiciados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.wasted_products.map((product) => (
              <div key={product.name} className="bg-white rounded-lg p-3 border border-red-200">
                <p className="font-semibold text-slate-800">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category}</p>
                <p className="text-sm text-red-600 mt-1">{product.times_wasted} veces desperdiciado</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {stats.recommendations.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            💡 Recomendaciones
          </h3>
          <ul className="space-y-2 text-sm">
            {stats.recommendations.map((rec, index) => (
              <li key={index} className={`
                ${rec.type === 'warning' ? 'text-orange-700' : ''}
                ${rec.type === 'success' ? 'text-green-700' : ''}
                ${rec.type === 'info' ? 'text-blue-700' : ''}
              `}>
                • {rec.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* User Stats Summary */}
      <div className="mt-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6">
        <h3 className="font-bold text-slate-800 mb-4">Resumen General</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-800">{stats.user.total_added}</p>
            <p className="text-xs text-slate-600">Productos Agregados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.user.total_consumed}</p>
            <p className="text-xs text-slate-600">Consumidos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.user.total_wasted}</p>
            <p className="text-xs text-slate-600">Desperdiciados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{stats.inventory.waste_rate}%</p>
            <p className="text-xs text-slate-600">Tasa de Desperdicio</p>
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
  );
};

export default Statistics;
