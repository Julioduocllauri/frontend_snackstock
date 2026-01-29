import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Package, AlertTriangle, BarChart3 } from 'lucide-react';

interface ProductStat {
  name: string;
  category: string;
  consumptionRate: number;
  trend: 'up' | 'down';
  timesConsumed: number;
}

const Statistics: React.FC = () => {
  // Mock data - esto vendrá de tu API
  const [topConsumed] = useState<ProductStat[]>([
    { name: 'Leche', category: 'Lácteos', consumptionRate: 85, trend: 'up', timesConsumed: 12 },
    { name: 'Pan', category: 'Panadería', consumptionRate: 78, trend: 'up', timesConsumed: 10 },
    { name: 'Huevos', category: 'Proteínas', consumptionRate: 72, trend: 'down', timesConsumed: 9 },
    { name: 'Yogurt', category: 'Lácteos', consumptionRate: 65, trend: 'up', timesConsumed: 8 },
  ]);

  const [leastConsumed] = useState<ProductStat[]>([
    { name: 'Quinoa', category: 'Granos', consumptionRate: 15, trend: 'down', timesConsumed: 1 },
    { name: 'Tofu', category: 'Proteínas', consumptionRate: 22, trend: 'down', timesConsumed: 2 },
    { name: 'Kale', category: 'Verduras', consumptionRate: 28, trend: 'up', timesConsumed: 2 },
    { name: 'Alga Nori', category: 'Especias', consumptionRate: 31, trend: 'down', timesConsumed: 3 },
  ]);

  const [stats] = useState({
    totalProducts: 45,
    criticalProducts: 8,
    averageConsumption: 62,
    savedFromWaste: 23
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <BarChart3 className="text-blue-500" size={32} />
          Estadísticas de Consumo
        </h1>
        <p className="text-slate-500">Analiza tus patrones de consumo y optimiza tu despensa</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-blue-500" size={24} />
            <span className="text-xs font-medium text-slate-500 uppercase">Total Productos</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.totalProducts}</p>
          <p className="text-sm text-slate-500 mt-1">En inventario</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="text-red-500" size={24} />
            <span className="text-xs font-medium text-slate-500 uppercase">Críticos</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.criticalProducts}</p>
          <p className="text-sm text-slate-500 mt-1">Por vencer pronto</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="text-green-500" size={24} />
            <span className="text-xs font-medium text-slate-500 uppercase">Consumo Promedio</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.averageConsumption}%</p>
          <p className="text-sm text-slate-500 mt-1">Tasa de uso</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="text-white" size={24} />
            <span className="text-xs font-medium text-green-100 uppercase">Salvados</span>
          </div>
          <p className="text-3xl font-bold">{stats.savedFromWaste}</p>
          <p className="text-sm text-green-100 mt-1">Del desperdicio</p>
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
            {topConsumed.map((product, index) => (
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
                      <p className="font-bold text-green-600">{product.consumptionRate}%</p>
                      <p className="text-xs text-slate-500">{product.timesConsumed} veces</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${product.consumptionRate}%` }}
                    />
                  </div>
                </div>
                {product.trend === 'up' ? (
                  <TrendingUp className="text-green-500" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
              </div>
            ))}
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
            {leastConsumed.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-slate-800">{product.name}</h3>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">{product.consumptionRate}%</p>
                      <p className="text-xs text-slate-500">{product.timesConsumed} veces</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${product.consumptionRate}%` }}
                    />
                  </div>
                </div>
                {product.trend === 'up' ? (
                  <TrendingUp className="text-green-500" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          💡 Recomendaciones
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>• Considera dejar de comprar <strong>Quinoa</strong> y <strong>Tofu</strong> si no los consumes frecuentemente</li>
          <li>• Los productos lácteos son tus favoritos, asegúrate de tener stock suficiente</li>
          <li>• Tienes {stats.criticalProducts} productos por vencer, ¡genera recetas para aprovecharlos!</li>
        </ul>
      </div>
    </div>
  );
};

export default Statistics;
