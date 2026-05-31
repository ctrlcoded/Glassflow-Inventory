import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Topbar({ onMenuToggle }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-20 flex items-center justify-between px-4 sm:px-6 md:px-8 z-10 w-full pt-2">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-white/60 dark:border-white/10 rounded-xl leading-5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/60 dark:bg-slate-800/60 dark:focus:bg-slate-800/60 dark:text-slate-200 transition-all shadow-sm sm:text-sm"
            placeholder="Search everywhere..."
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-200 transition-colors duration-200"
          title="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-200 transition-colors duration-200 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-2 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white dark:ring-slate-900 shadow-sm"></span>
        </button>
      </div>
    </header>
  );
}
