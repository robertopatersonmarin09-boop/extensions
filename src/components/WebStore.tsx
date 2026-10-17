import React, { useState } from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { ExtensionIcon } from './ExtensionIcon';
import { ExtensionCategory } from '../types/extension';
import { 
  Search, 
  Star, 
  Download, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';

export const WebStore: React.FC = () => {
  const { extensions, installExtension, uninstallExtension, setActiveTab, setInspectingExtension } = useExtensions();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExtensionCategory>('all');

  const categories: { id: ExtensionCategory; name: string; icon: string }[] = [
    { id: 'all', name: 'Todas las extensiones', icon: '✨' },
    { id: 'blockers', name: 'Bloqueadores de Anuncios', icon: '🛡️' },
    { id: 'audio_video', name: 'Audio y Vídeo', icon: '🔊' },
    { id: 'stealth', name: 'Camuflaje y Pánico', icon: '👻' },
    { id: 'games_cheats', name: 'Juegos y Trucos', icon: '🎮' },
    { id: 'productivity', name: 'Herramientas Escolares', icon: '⚡' }
  ];

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch =
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ext.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-full pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      {/* Chrome Web Store Header Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-xl overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Optimizadas para Chromebooks y Redes Escolares</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Chrome Web Store Integrada
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Instala extensiones adaptadas que funcionan dentro de tu página web de juegos y proxies, burlando bloqueos de administrador y filtros del colegio.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('hub')}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Abrir Navegador & Juegos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('extensions')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              Gestionar Instaladas
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en la Chrome Web Store..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured highlight strip */}
      <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Flame className="w-4 h-4 text-amber-500" />
        <span>Extensiones Populares para Clase</span>
      </div>

      {/* Extensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExtensions.map(ext => (
          <div
            key={ext.id}
            className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between p-5 group"
          >
            <div>
              {/* Top: Icon + Rating + Users */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <ExtensionIcon iconName={ext.icon} size={48} />
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-800">{ext.rating}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-0.5">{ext.usersCount} usuarios</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 
                onClick={() => setInspectingExtension(ext)}
                className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
              >
                {ext.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed">
                {ext.description}
              </p>

              {/* Author badge */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Desarrollado por {ext.author}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setInspectingExtension(ext)}
                className="text-xs font-medium text-gray-500 hover:text-blue-600 cursor-pointer"
              >
                Ver detalles
              </button>

              {ext.installed ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    <Check className="w-3 h-3" />
                    <span>Instalada</span>
                  </span>
                  <button
                    onClick={() => uninstallExtension(ext.id)}
                    className="text-xs text-red-500 hover:text-red-700 cursor-pointer px-1"
                    title="Desinstalar"
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => installExtension(ext.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Añadir a Chrome</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
