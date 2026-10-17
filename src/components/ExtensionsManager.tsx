import React, { useState } from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { ExtensionIcon } from './ExtensionIcon';
import { Search, Plus, RotateCw, ExternalLink, ShieldCheck, Sparkles, Filter, Terminal, BookOpen } from 'lucide-react';
import { Extension } from '../types/extension';
import { ProxyIntegrationModal } from './ProxyIntegrationModal';

interface Props {
  onOpenCustomModal: () => void;
}

export const ExtensionsManager: React.FC<Props> = ({ onOpenCustomModal }) => {
  const {
    extensions,
    toggleExtension,
    uninstallExtension,
    setInspectingExtension,
    setActiveTab,
    devMode,
    setDevMode
  } = useExtensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [proxyModalOpen, setProxyModalOpen] = useState(false);

  // Installed extensions only for this view (like chrome://extensions)
  const installedExtensions = extensions.filter(ext => ext.installed);

  const filteredExtensions = installedExtensions.filter(ext => {
    const matchesSearch = 
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === 'all') return matchesSearch;
    if (filterCategory === 'enabled') return matchesSearch && ext.enabled;
    if (filterCategory === 'disabled') return matchesSearch && !ext.enabled;
    if (filterCategory === 'custom') return matchesSearch && ext.isCustom;
    return matchesSearch && ext.category === filterCategory;
  });

  const handleUpdateAll = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
    }, 800);
  };

  return (
    <div className="min-h-full pb-16">
      {/* Top Banner / Chrome Web Store Link - exactly as in user screenshot */}
      <div className="flex flex-col items-center justify-center pt-6 pb-4 px-4">
        <button
          onClick={() => setActiveTab('store')}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5 group cursor-pointer"
        >
          <span>Encuentra extensiones y temas en la</span>
          <span className="underline decoration-blue-600 group-hover:decoration-blue-800 font-semibold">Web Store</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Developer Bar / Secondary Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs mb-8 p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar extensiones instaladas..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Controls & Developer Mode Switch */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/80">
                <span className="text-xs font-medium text-gray-600 select-none">Modo de desarrollador</span>
                <button
                  type="button"
                  onClick={() => setDevMode(!devMode)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    devMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={devMode}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      devMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {devMode && (
                <button
                  onClick={onOpenCustomModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cargar descomprimida</span>
                </button>
              )}

              <button
                onClick={handleUpdateAll}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                title="Comprobar actualizaciones de extensiones"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-blue-600' : 'text-gray-500'}`} />
                <span>{isUpdating ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 overflow-x-auto text-xs pb-1">
            <span className="text-gray-400 font-medium flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3" /> Filtrar:
            </span>
            {[
              { id: 'all', label: `Todas (${installedExtensions.length})` },
              { id: 'enabled', label: `Activas (${installedExtensions.filter(e => e.enabled).length})` },
              { id: 'disabled', label: `Desactivadas (${installedExtensions.filter(e => !e.enabled).length})` },
              { id: 'blockers', label: '🛡️ Bloqueadores' },
              { id: 'audio_video', label: '🔊 Audio & Video' },
              { id: 'stealth', label: '👻 Camuflaje' },
              { id: 'games_cheats', label: '⚡ Juegos' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Heading: "Todas las extensiones" */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal text-gray-800 tracking-tight">
            Todas las extensiones
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            {filteredExtensions.length} {filteredExtensions.length === 1 ? 'extensión' : 'extensiones'}
          </span>
        </div>

        {/* Extensions Cards Grid (Matching user's screenshot layout and style) */}
        {filteredExtensions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredExtensions.map(ext => (
              <div
                key={ext.id}
                className={`bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between p-5 hover:shadow-md ${
                  ext.enabled
                    ? 'border-gray-200/90 shadow-xs'
                    : 'border-gray-200/60 opacity-80 bg-gray-50/50'
                }`}
              >
                {/* Upper Area: Icon + Title & Description */}
                <div className="flex items-start gap-4">
                  {/* Extension Icon */}
                  <div className="shrink-0 pt-0.5">
                    <ExtensionIcon iconName={ext.icon} size={46} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
                        {ext.name}
                      </h3>
                      {ext.isCustom && (
                        <span className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {ext.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: [Detalles] [Quitar] and Toggle Switch */}
                <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100/80">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInspectingExtension(ext)}
                      className="px-4 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50/70 border border-blue-600/30 rounded-full transition-colors cursor-pointer shadow-2xs"
                    >
                      Detalles
                    </button>
                    <button
                      type="button"
                      onClick={() => uninstallExtension(ext.id)}
                      className="px-4 py-1.5 text-xs font-medium text-blue-600 hover:text-red-600 bg-white hover:bg-red-50/70 border border-blue-600/30 hover:border-red-300 rounded-full transition-colors cursor-pointer shadow-2xs"
                    >
                      Quitar
                    </button>
                  </div>

                  {/* Switch matching Chrome's toggle */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => toggleExtension(ext.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        ext.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={ext.enabled}
                      title={ext.enabled ? 'Desactivar extensión' : 'Activar extensión'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          ext.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 shadow-xs">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-semibold text-gray-800">No se encontraron extensiones</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              No hay extensiones instaladas que coincidan con los filtros actuales. Puedes buscar e instalar nuevas desde la tienda integrada.
            </p>
            <button
              onClick={() => setActiveTab('store')}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorar Web Store</span>
            </button>
          </div>
        )}

        {/* Helpful School Chromebook Tips Box */}
        <div className="mt-10 bg-linear-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border border-blue-100 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-950">
                ¿Cómo funcionan estas extensiones dentro de tu página web de juegos y proxies?
              </h4>
              <p className="text-xs text-blue-900/80 mt-1 leading-relaxed">
                Dado que los Chromebooks escolares bloquean la instalación de extensiones de navegador directas, estas extensiones se ejecutan internamente dentro del entorno de navegación, juegos y reproductor de la página. Por ejemplo, al activar <strong>uBlock Ultra</strong>, los anuncios de Spotify Web y YouTube quedan bloqueados automáticamente; con <strong>Volume Master</strong> puedes superar el 100% del audio escolar hasta el 600%, y con <strong>Tab Cloak</strong> pulsando <kbd className="px-1.5 py-0.5 bg-white/90 border border-blue-200 rounded font-mono text-[10px] text-blue-950">Esc</kbd> camuflas la pantalla con Google Classroom si el profesor se acerca.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab('hub')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Ir al Navegador de Juegos & Spotify →
                </button>
                <button
                  onClick={() => setProxyModalOpen(true)}
                  className="px-3.5 py-1.5 bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>¿Cómo bloquear anuncios en tu propio Proxy? (Código para copiar)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProxyIntegrationModal
        isOpen={proxyModalOpen}
        onClose={() => setProxyModalOpen(false)}
      />
    </div>
  );
};
