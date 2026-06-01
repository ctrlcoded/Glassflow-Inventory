import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import GlassModal from '../components/GlassModal';
import GlassInput from '../components/GlassInput';
import { Plus, Edit2, Trash2, Search, PackageOpen } from 'lucide-react';
import { useToast } from '../components/Toast';
import api from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({ name: product.name, sku: product.sku, price: product.price, quantity: product.quantity });
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', sku: '', price: '', quantity: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity, 10)
      };

      if (currentProduct) {
        await api.put(`/products/${currentProduct.id}`, data);
        toast('Product updated successfully', 'success');
      } else {
        await api.post('/products', data);
        toast('Product created successfully', 'success');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast(error.response?.data?.detail || 'Error saving product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        toast('Product deleted successfully', 'success');
        fetchProducts();
      } catch (error) {
        toast(error.response?.data?.detail || 'Error deleting product', 'error');
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Inventory</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your product catalog.</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Inventory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your product catalog.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="glass-input pl-9 py-2 text-sm"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button onClick={() => openModal()} className="glass-button-primary flex items-center whitespace-nowrap">
             <Plus className="w-4 h-4 mr-2" /> Add Product
           </button>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase border-b border-white/40 dark:border-white/10">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20 dark:divide-white/10">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/20 dark:bg-slate-800/20 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-100">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.quantity > 10 ? (
                        <span className="pill-green">{product.quantity} In Stock</span>
                    ) : product.quantity > 0 ? (
                        <span className="pill-yellow">{product.quantity} Low Stock</span>
                    ) : (
                        <span className="pill-red">Out of Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(product)} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-100 mr-3 transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
             <div className="p-12 text-center">
               <PackageOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 dark:text-slate-400 font-medium">{searchTerm ? 'No products match your search.' : 'No products found. Add one to get started!'}</p>
             </div>
          )}
        </div>
      </GlassCard>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentProduct ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <GlassInput 
            label="Product Name" 
            id="prod-name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
            placeholder="e.g. Ergonomic Office Chair"
          />
          <GlassInput 
            label="SKU / Code" 
            id="prod-sku" 
            value={formData.sku} 
            onChange={e => setFormData({...formData, sku: e.target.value})} 
            required 
            disabled={!!currentProduct}
            placeholder="e.g. FUR-001"
          />
          <div className="grid grid-cols-2 gap-4">
            <GlassInput 
              label="Price ($)" 
              id="prod-price" 
              type="number" 
              step="0.01" 
              min="0.01" 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
              required 
              placeholder="0.00"
            />
            <GlassInput 
              label="Quantity" 
              id="prod-qty" 
              type="number" 
              min="0" 
              value={formData.quantity} 
              onChange={e => setFormData({...formData, quantity: e.target.value})} 
              required 
              placeholder="0"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/40 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="glass-button">Cancel</button>
            <button type="submit" className="glass-button-primary">{currentProduct ? 'Update Product' : 'Save Product'}</button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
