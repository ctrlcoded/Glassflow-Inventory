import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Package, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, lowStock: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/customers'),
          api.get('/orders')
        ]);
        
        const products = productsRes.data;
        const orders = ordersRes.data;
        const lowStock = products.filter(p => p.quantity <= 10 && p.quantity > 0);
        const outOfStock = products.filter(p => p.quantity === 0);
        
        setStats({
          products: products.length,
          customers: customersRes.data.length,
          orders: orders.length,
          lowStock: lowStock.length + outOfStock.length
        });

        setLowStockProducts([...outOfStock, ...lowStock].slice(0, 5));

        // Show most recent orders
        const customers = customersRes.data;
        const recentOrd = orders.slice(-5).reverse().map(o => {
          const cust = customers.find(c => c.id === o.customer_id);
          return {
            id: o.id,
            customer: cust ? cust.name : 'Unknown',
            total: o.total_amount,
            status: o.status,
            date: o.order_date
          };
        });
        setRecentOrders(recentOrd);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your inventory today.</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Overview</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here is what's happening with your inventory today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shadow-sm border border-blue-100/50">
                <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.products}</p>
        </GlassCard>

        <GlassCard className="flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50/80 flex items-center justify-center shadow-sm border border-violet-100/50">
                <Users className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Customers</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.customers}</p>
        </GlassCard>

        <GlassCard className="flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50/80 flex items-center justify-center shadow-sm border border-emerald-100/50">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.orders}</p>
        </GlassCard>

        <GlassCard className="flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100/60 flex items-center justify-center shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            {stats.lowStock > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100/80 text-red-700 border border-red-200/50">Action Needed</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Low Stock Items</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{stats.lowStock}</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/40 dark:border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase border-b border-white/40 dark:border-white/10">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 dark:divide-white/10">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/20 dark:bg-slate-800/20 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-100">#ORD-{order.id.toString().padStart(4, '0')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={
                        order.status === 'Processing' ? 'pill-blue' :
                        order.status === 'Shipped' ? 'pill-yellow' :
                        'pill-green'
                      }>
                          {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800 dark:text-slate-100 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentOrders.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No orders yet.</div>
            )}
          </div>
        </GlassCard>

        {/* Low Stock Alert */}
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/40 dark:border-white/10 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Low Stock Alert</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase border-b border-white/40 dark:border-white/10">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20 dark:divide-white/10">
                {lowStockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/20 dark:bg-slate-800/20 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-white/60 dark:bg-slate-800/60 mr-3 flex items-center justify-center shadow-sm">
                            <Package className="w-4 h-4 text-slate-500 dark:text-slate-400"/>
                        </div>
                        {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={product.quantity === 0 ? 'pill-red' : 'pill-yellow'}>
                        {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} left`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {lowStockProducts.length === 0 && (
                <div className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400">All products are well stocked! 🎉</div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
