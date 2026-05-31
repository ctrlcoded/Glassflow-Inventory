import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, HelpCircle, User, X } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/products', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <div className={`
      fixed md:static inset-y-0 left-0 z-40
      flex flex-col w-64 h-full glass border-l-0 border-y-0 rounded-l-none rounded-r-3xl
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center justify-between h-20 px-8">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-slate-800 dark:bg-indigo-600 flex items-center justify-center mr-3 shadow-md">
            <Package className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">GlassFlow</h1>
        </div>
        <button onClick={onClose} className="md:hidden p-1 rounded-full hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 shadow-sm border border-white/50 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-white/40 dark:border-white/10 space-y-2">
        <button className="flex w-full items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-200 hover:text-slate-900 dark:hover:text-slate-200">
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </button>
        <button className="flex w-full items-center px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-200 hover:text-slate-900 dark:hover:text-slate-200">
          <HelpCircle className="w-5 h-5 mr-3" />
          Support
        </button>
      </div>
      <div className="p-4 pb-6 px-8 flex items-center">
         <div className="w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white/60 dark:border-white/10 flex items-center justify-center shadow-sm">
             <User className="w-5 h-5 text-slate-600 dark:text-slate-300"/>
         </div>
         <div className="ml-3">
             <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin</p>
         </div>
      </div>
    </div>
  );
}
