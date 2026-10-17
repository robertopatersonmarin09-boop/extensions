import React from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { 
  Puzzle, 
  Store, 
  Gamepad2, 
  Ghost, 
  Wifi, 
  BatteryMedium, 
  Volume2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types/extension';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    triggerPanic, 
    extensions,
    volumeMultiplier,
    isExtensionActive
  } = useExtensions();

  const activeExtensionsCount = extensions.filter(e => e.installed && e.enabled).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Chromebook Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Puzzle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm tracking-tight">ChromeOS Hub</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                  Extensiones & Proxies
                </span>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200/80">
            <button
              onClick={() => setActiveTab('extensions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'extensions'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5 text-blue-600" />
              <span>Extensiones</span>
            </button>

            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'store'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span>Web Store</span>
            </button>

            <button
              onClick={() => setActiveTab('hub')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hub'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Navegador & Juegos</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </nav>

          {/* Right Area: Panic Button & Status */}
          <div className="flex items-center gap-3">
            {/* Panic Cloak Button */}
            <button
              onClick={triggerPanic}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold border border-red-200/80 transition-all cursor-pointer shadow-2xs group"
              title="Activar camuflaje escolar de emergencia (también con tecla Esc)"
            >
              <Ghost className="w-3.5 h-3.5 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Pánico (Esc)</span>
            </button>

            {/* Active Extensions Pill */}
            <div 
              onClick={() => setActiveTab('extensions')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
              title="Extensiones activadas"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="font-semibold">{activeExtensionsCount} activas</span>
            </div>

            {/* Chromebook Status Bar Icons */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-gray-200 text-gray-400">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <BatteryMedium className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-mono text-gray-600 font-medium">10:45</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
