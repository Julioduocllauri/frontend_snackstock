import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Package, X } from 'lucide-react';
import { getPantryItems, Product, updateProduct, deleteProduct, createProduct } from '../services/api';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import ContextualTip from '../components/ContextualTip';
import TourGuide, { TourStep } from '../components/TourGuide';
import HelpButton from '../components/HelpButton';
import { useTour } from '../hooks/useTour';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    title: string; 
    message: string; 
    productId: number;
  } | null>(null);
  const [editModal, setEditModal] = useState<{
    product: Product | null;
    isNew: boolean;
  }>({ product: null, isNew: false });
  const [showInventoryTip, setShowInventoryTip] = useState(false);

  // Tour guiado
  const { isActive: isTourActive, completeTour, skipTour, startTour } = useTour('inventory-tour', 1000);

  // Pasos del tour
  const tourSteps: TourStep[] = [
    {
      target: '#search-bar',
      title: 'Buscar productos',
      description: 'Usa esta barra de búsqueda para encontrar rápidamente cualquier producto de tu inventario por su nombre.',
      position: 'bottom'
    },
    {
      target: '#category-filter',
      title: 'Filtrar por categoría',
      description: 'Filtra tus productos por categoría: Lácteos, Proteínas, Verduras, Frutas, etc. ¡Así encuentras todo más fácil!',
      position: 'bottom'
    },
    {
      target: '#add-button',
      title: 'Agregar productos',
      description: 'Presiona aquí para agregar productos manualmente a tu inventario. Útil para cuando no puedes escanear una boleta.',
      position: 'left'
    },
    {
      target: '#products-table',
      title: 'Tabla de productos',
      description: 'Aquí verás todos tus productos con su información: nombre, categoría, días restantes y estado. Puedes editar o eliminar usando los botones de la derecha.',
      position: 'top'
    }
  ];

  useEffect(() => {
    loadData();
    
    // Mostrar tip si es la primera vez
    const inventoryTipShown = localStorage.getItem('inventoryTipShown');
    if (!inventoryTipShown) {
      setTimeout(() => setShowInventoryTip(true), 800);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getPantryItems();
    setProducts(data);
    setLoading(false);
  };

  const handleDelete = (product: Product) => {
    setConfirmDialog({
      title: 'Eliminar Producto',
      message: `¿Estás seguro de que quieres eliminar "${product.name}"?`,
      productId: product.id!
    });
  };

  const confirmDelete = async () => {
    if (!confirmDialog) return;
    
    try {
      await deleteProduct(confirmDialog.productId);
      await loadData();
      setToast({ message: 'Producto eliminado exitosamente', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error al eliminar el producto', type: 'error' });
    } finally {
      setConfirmDialog(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditModal({ product: { ...product }, isNew: false });
  };

  const handleAdd = () => {
    setEditModal({ 
      product: {
        name: '',
        quantity: 1,
        category: 'General',
        expiry_date: '',
        status: 'green',
        days_left: 0
      }, 
      isNew: true 
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 handleSaveProduct iniciado');
    console.log('📦 Producto:', editModal.product);
    
    if (!editModal.product) {
      console.log('❌ No hay producto para guardar');
      return;
    }

    try {
      console.log('💾 Guardando producto...');
      
      // Preparar datos solo con campos que se pueden guardar
      const { status, days_left, ...productData } = editModal.product;
      console.log('📤 Datos a enviar:', productData);
      
      if (editModal.isNew) {
        console.log('➕ Creando nuevo producto');
        const result = await createProduct(productData);
        console.log('✅ Producto creado:', result);
        setToast({ message: 'Producto agregado exitosamente', type: 'success' });
      } else {
        console.log('✏️ Actualizando producto ID:', editModal.product.id);
        const result = await updateProduct(editModal.product.id!, productData);
        console.log('✅ Producto actualizado:', result);
        setToast({ message: 'Producto actualizado exitosamente', type: 'success' });
      }
      console.log('🔄 Recargando datos...');
      await loadData();
      console.log('✅ Datos recargados');
    } catch (error) {
      console.error('❌ Error al guardar:', error);
      setToast({ message: 'Error al guardar el producto', type: 'error' });
    } finally {
      console.log('🚪 Cerrando modal...');
      setEditModal({ product: null, isNew: false });
      console.log('✅ Modal cerrado');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(p => p.category || 'General')));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* HELP BUTTON */}
      <HelpButton onRestartTour={startTour} tourKey="inventory-tour" />

      {/* TOUR GUIDE */}
      <TourGuide
        steps={tourSteps}
        isActive={isTourActive && products.length > 0}
        onComplete={completeTour}
        onSkip={skipTour}
        tourKey="inventory-tour"
      />

      {/* CONTEXTUAL TIP - INVENTORY */}
      <ContextualTip
        isOpen={showInventoryTip}
        onClose={() => {
          setShowInventoryTip(false);
          localStorage.setItem('inventoryTipShown', 'true');
        }}
        title="¿Cómo usar el inventario? 📦"
        description="Aquí verás todos tus productos. Puedes EDITAR haciendo clic en el lápiz, o ELIMINAR con la X. Cuando consumas un producto, márcalo como 'Consumido' para que se registre en tus estadísticas. Usa los filtros para buscar más fácil."
        icon={<Package className="w-6 h-6" />}
        position="center"
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Inventario</h1>
        <p className="text-slate-500">Gestiona todos tus productos de la despensa</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative" id="search-bar">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Add Button */}
          <button 
            id="add-button"
            onClick={handleAdd}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Agregar
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden" id="products-table">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Días restantes</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No se encontraron productos</p>
                  </td>
                </tr>
              )}
              
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 capitalize">{product.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{product.category || 'General'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{product.days_left} días</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === 'red' 
                        ? 'bg-red-100 text-red-600' 
                        : product.status === 'yellow' 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {product.status === 'red' ? 'Crítico' : product.status === 'yellow' ? 'Atención' : 'Óptimo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editModal.product && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setEditModal({ product: null, isNew: false })}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">
                {editModal.isNew ? 'Agregar Producto' : 'Editar Producto'}
              </h3>
              <button
                onClick={() => setEditModal({ product: null, isNew: false })}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  required
                  value={editModal.product.name}
                  onChange={(e) => setEditModal({
                    ...editModal,
                    product: { ...editModal.product!, name: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Leche"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editModal.product.quantity}
                    onChange={(e) => setEditModal({
                      ...editModal,
                      product: { ...editModal.product!, quantity: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={editModal.product.category}
                    onChange={(e) => setEditModal({
                      ...editModal,
                      product: { ...editModal.product!, category: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lácteos">Lácteos</option>
                    <option value="Proteínas">Proteínas</option>
                    <option value="Verduras">Verduras</option>
                    <option value="Frutas">Frutas</option>
                    <option value="Granos">Granos</option>
                    <option value="Panadería">Panadería</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={editModal.product.expiry_date || ''}
                  onChange={(e) => setEditModal({
                    ...editModal,
                    product: { ...editModal.product!, expiry_date: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal({ product: null, isNew: false })}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  {editModal.isNew ? 'Agregar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog(null)}
          confirmText="Eliminar"
          cancelText="Cancelar"
          type="danger"
        />
      )}
    </div>
  );
};

export default Inventory;
