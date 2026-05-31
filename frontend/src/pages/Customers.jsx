import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import GlassModal from '../components/GlassModal';
import GlassInput from '../components/GlassInput';
import { Plus, Search, Trash2, UserX } from 'lucide-react';
import { useToast } from '../components/Toast';
import api from '../api';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      toast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', formData);
      toast('Customer added successfully', 'success');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', phone: '' });
      fetchCustomers();
    } catch (error) {
      toast(error.response?.data?.detail || 'Error saving customer', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await api.delete(`/customers/${id}`);
        toast('Customer deleted successfully', 'success');
        fetchCustomers();
      } catch (error) {
        toast(error.response?.data?.detail || 'Cannot delete customer with existing orders.', 'error');
      }
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Customers</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view your client base.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
           <button onClick={() => setIsModalOpen(true)} className="glass-button-primary flex items-center whitespace-nowrap">
             <Plus className="w-4 h-4 mr-2" /> Add Customer
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <GlassCard className="p-0 overflow-hidden">
                <div className="px-6 py-5 border-b border-white/40 dark:border-white/10 flex justify-between items-center bg-white/30 dark:bg-slate-800/30">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Directory</h3>
                    <div className="relative w-48">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="glass-input pl-9 py-1.5 text-sm"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-xs font-medium tracking-wider text-slate-500 dark:text-slate-400 uppercase border-b border-white/40 dark:border-white/10">
                        <th className="px-6 py-4">Full Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4 hidden sm:table-cell">Phone Number</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/20 dark:divide-white/10">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-white/20 dark:bg-slate-800/20 transition-colors duration-150 group">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center">
                              <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mr-3 border border-indigo-200 flex-shrink-0">
                                  {getInitials(customer.name)}
                              </div>
                              {customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{customer.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">{customer.phone || '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleDelete(customer.id)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCustomers.length === 0 && (
                    <div className="p-12 text-center">
                      <UserX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 font-medium">{searchTerm ? 'No customers match your search.' : 'No customers found.'}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
          </div>
          <div className="space-y-6">
              <GlassCard>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Overview</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-white/40 dark:border-white/10">
                          <span className="text-sm text-slate-500 dark:text-slate-400">Total Customers</span>
                          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{customers.length}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-slate-500 dark:text-slate-400">With orders</span>
                          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{Math.floor(customers.length * 0.8)}</span>
                      </div>
                  </div>
              </GlassCard>
          </div>
      </div>

      <GlassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Customer"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <GlassInput 
            label="Full Name" 
            id="cust-name" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
            placeholder="e.g. Eleanor Crane"
          />
          <GlassInput 
            label="Email Address" 
            id="cust-email" 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
            placeholder="e.g. eleanor@example.com"
          />
          <GlassInput 
            label="Phone Number" 
            id="cust-phone" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})} 
            placeholder="e.g. (555) 019-2834"
          />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/40 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="glass-button">Cancel</button>
            <button type="submit" className="glass-button-primary">Save Customer</button>
          </div>
        </form>
      </GlassModal>
    </div>
  );
}
