import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import GlassModal from '../components/GlassModal';
import { Plus, CheckCircle, Package, Trash2, X, ShoppingBag } from 'lucide-react';
import { useToast } from '../components/Toast';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const toast = useToast();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
        api.get('/customers')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      toast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || orderItems.length === 0) {
      toast('Please select a customer and add items', 'error');
      return;
    }

    try {
      const data = {
        customer_id: parseInt(selectedCustomerId, 10),
        status: "Processing",
        items: orderItems.map(item => ({
          product_id: parseInt(item.product_id, 10),
          quantity: parseInt(item.quantity, 10)
        }))
      };

      await api.post('/orders', data);
      toast('Order placed successfully!', 'success');
      setIsModalOpen(false);
      setSelectedCustomerId('');
      setOrderItems([{ product_id: '', quantity: 1 }]);
      fetchData();
    } catch (error) {
      toast(error.response?.data?.detail || 'Error creating order', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Cancel this order? Inventory will be restored.")) {
      try {
        await api.delete(`/orders/${id}`);
        toast('Order cancelled. Stock restored.', 'success');
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder(null);
        }
        fetchData();
      } catch (error) {
        toast(error.response?.data?.detail || 'Error cancelling order', 'error');
      }
    }
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(selectedOrder?.id === order.id ? null : order);
  };

  const getCustomerName = (id) => {
    const c = customers.find(c => c.id === id);
    return c ? c.name : 'Unknown';
  };

  const getProductName = (id) => {
    const p = products.find(p => p.id === id);
    return p ? p.name : `Product #${id}`;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Orders</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track customer fulfillment.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="glass-button-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" /> Create Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <GlassCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase border-b border-white/40 dark:border-white/10">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 hidden sm:table-cell">Total</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20 dark:divide-white/10">
                    {orders.map((order) => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-white/20 dark:bg-slate-800/20 transition-colors duration-150 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-white/30 dark:bg-slate-800/30 ring-1 ring-inset ring-slate-200' : ''}`}
                        onClick={() => handleSelectOrder(order)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-100">#ORD-{order.id.toString().padStart(4, '0')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">{getCustomerName(order.customer_id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            order.status === 'Processing' ? 'pill-blue' :
                            order.status === 'Shipped' ? 'pill-yellow' :
                            'pill-green'
                          }>
                              {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-100 hidden sm:table-cell">${order.total_amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }} 
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Cancel Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <div className="p-12 text-center">
                    <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">No orders placed yet.</p>
                  </div>
                )}
              </div>
            </GlassCard>
        </div>
        
        <div>
          {selectedOrder ? (
            <GlassCard className="relative animate-in fade-in slide-in-from-right-4 duration-300">
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Order #{selectedOrder.id.toString().padStart(4, '0')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Customer</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100">{getCustomerName(selectedOrder.customer_id)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className={
                    selectedOrder.status === 'Processing' ? 'pill-blue' :
                    selectedOrder.status === 'Shipped' ? 'pill-yellow' :
                    'pill-green'
                  }>{selectedOrder.status}</span>
                </div>
              </div>

              <div className="border-t border-white/40 dark:border-white/10 pt-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Line Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 glass-panel">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-white/60 dark:bg-slate-800/60 flex items-center justify-center shadow-sm">
                          <Package className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{getProductName(item.product_id)}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price_at_time.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">${(item.quantity * item.price_at_time).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/40 dark:border-white/10 mt-4 pt-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Total</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="h-full flex flex-col items-center justify-center text-center p-8 bg-white/30 dark:bg-slate-800/30 border-dashed">
                <CheckCircle className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600">Select an order</h3>
                <p className="text-sm text-slate-400 mt-2">Click on any order in the table to view its full details and line items here.</p>
            </GlassCard>
          )}
        </div>
      </div>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-6">
          <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 ml-1">Select Customer</label>
              <select 
                  className="glass-input"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  required
              >
                  <option value="">-- Choose a customer --</option>
                  {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
              </select>
          </div>

          <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-white/40 dark:border-white/10 pb-2">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Order Items</h4>
                  <button type="button" onClick={handleAddItem} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                      + Add Item
                  </button>
              </div>
              
              {orderItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 glass-panel relative">
                      <div className="flex-1">
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Product</label>
                          <select 
                              className="glass-input py-1.5 px-3 text-sm"
                              value={item.product_id}
                              onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                              required
                          >
                              <option value="">Select product...</option>
                              {products.map(p => (
                                  <option key={p.id} value={p.id} disabled={p.quantity === 0}>
                                      {p.name} - ${p.price} ({p.quantity} left)
                                  </option>
                              ))}
                          </select>
                      </div>
                      <div className="w-24">
                          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Qty</label>
                          <input 
                              type="number" 
                              min="1"
                              className="glass-input py-1.5 px-3 text-sm"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              required
                          />
                      </div>
                      {orderItems.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItem(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm hover:bg-red-200 transition-colors">
                              &times;
                          </button>
                      )}
                  </div>
              ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/40 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="glass-button">Cancel</button>
            <button type="submit" className="glass-button-primary">Place Order</button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
