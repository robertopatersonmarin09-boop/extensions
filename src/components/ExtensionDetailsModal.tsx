import React, { useState } from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { ExtensionIcon } from './ExtensionIcon';
import { 
  X, 
  ShieldAlert, 
  Sliders, 
  Volume2, 
  Key, 
  ExternalLink, 
  Play, 
  Trash2,
  CheckCircle2,
  Code2
} from 'lucide-react';

export const ExtensionDetailsModal: React.FC = () => {
  const {
    inspectingExtension,
    setInspectingExtension,
    toggleExtension,
    uninstallExtension,
    updateExtensionSettings,
    volumeMultiplier,
    setVolumeMultiplier,
    bassBoost,
    setBassBoost,
    adsBlockedCount,
    incrementAdsBlocked,
    panicDisguise,
    setPanicDisguise,
    gameSpeed,
    setGameSpeed,
    darkReaderSettings,
    setDarkReaderSettings
  } = useExtensions();

  const [testAudioPlaying, setTestAudioPlaying] = useState(false);

  if (!inspectingExtension) return null;

  const ext = inspectingExtension;

  // Sound generator to test Volume Master boost in real time
  const playTestTone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Apply Volume Master gain: 100% = 0.2 gain, 600% = 1.2 gain
      const effectiveGain = (volumeMultiplier / 100) * 0.2;
      gain.gain.setValueAtTime(effectiveGain, audioCtx.currentTime);

      osc.type = bassBoost ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
      osc.frequency.exponentialRampToValueAtTime(523.25, audioCtx.currentTime + 0.3); // C5

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      setTestAudioPlaying(true);
      osc.stop(audioCtx.currentTime + 0.45);

      setTimeout(() => {
        setTestAudioPlaying(false);
      }, 500);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-gray-50/70">
          <div className="flex items-center gap-4">
            <ExtensionIcon iconName={ext.icon} size={52} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{ext.name}</h2>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-mono font-medium">
                  v{ext.version}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Por <span className="font-medium text-gray-700">{ext.author}</span> • {ext.usersCount} usuarios escolares
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Main Toggle */}
            <button
              type="button"
              onClick={() => toggleExtension(ext.id)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                ext.enabled ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={ext.enabled}
              title={ext.enabled ? 'Desactivar' : 'Activar'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  ext.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>

            <button
              onClick={() => setInspectingExtension(null)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Descripción
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              {ext.description}
            </p>
          </div>

          {/* Interactive Extension-specific Settings */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-blue-900 font-semibold text-sm">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Opciones y Configuración en Vivo</span>
            </div>

            {/* Volume Master Settings */}
            {ext.id === 'volume-master' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-gray-700">
                    <span>Nivel de Aumento de Ganancia</span>
                    <span className="font-bold text-blue-700 text-sm">{volumeMultiplier}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="600"
                    step="10"
                    value={volumeMultiplier}
                    onChange={e => setVolumeMultiplier(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-mono">
                    <span>100% (Normal)</span>
                    <span>300% (Fuerte)</span>
                    <span>600% (Máximo)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-blue-100/60">
                  <div className="text-xs">
                    <div className="font-medium text-gray-800">Refuerzo de Graves (Bass Boost)</div>
                    <div className="text-gray-500 text-[11px]">Mejora el sonido en auriculares baratos o altavoces integrados</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={bassBoost}
                    onChange={e => setBassBoost(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={playTestTone}
                    disabled={testAudioPlaying}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{testAudioPlaying ? 'Reproduciendo prueba...' : 'Probar tono amplificado'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* uBlock Ultra Settings */}
            {ext.id === 'adblocker-ultra' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-red-100">
                    <div className="text-2xl font-bold text-rose-600">{adsBlockedCount}</div>
                    <div className="text-xs text-gray-500">Anuncios bloqueados en esta sesión</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-red-100">
                    <div className="text-2xl font-bold text-emerald-600">Activo</div>
                    <div className="text-xs text-gray-500">Spotify & YouTube protegidos</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => incrementAdsBlocked(5)}
                    className="text-xs px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors font-medium cursor-pointer"
                  >
                    Simular bloqueo de anuncios (+5)
                  </button>
                </div>
              </div>
            )}

            {/* Tab Cloak Settings */}
            {ext.id === 'tab-cloak' && (
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-700">Disfraz escolar de emergencia (Panic Screen):</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'classroom', label: 'Google Classroom', desc: 'Tareas y clases escolares' },
                    { id: 'drive', label: 'Google Drive', desc: 'Carpetas de documentos' },
                    { id: 'docs', label: 'Documentos de Google', desc: 'Ensayo de historia' },
                    { id: 'wikipedia', label: 'Wikipedia', desc: 'Artículo educativo' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setPanicDisguise(option.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        panicDisguise === option.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">{option.label}</div>
                      <div className={`text-[10px] ${panicDisguise === option.id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5 pt-1">
                  <Key className="w-3.5 h-3.5 text-gray-400" />
                  <span>Tecla rápida de pánico: pulsa <kbd className="px-1.5 py-0.5 bg-gray-200 border rounded font-mono text-[10px] font-bold">Esc</kbd> o <kbd className="px-1.5 py-0.5 bg-gray-200 border rounded font-mono text-[10px] font-bold">`</kbd> en cualquier momento</span>
                </div>
              </div>
            )}

            {/* Dark Reader Settings */}
            {ext.id === 'dark-reader' && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
                    <span>Brillo ({darkReaderSettings.brightness}%)</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={darkReaderSettings.brightness}
                    onChange={e => setDarkReaderSettings({ ...darkReaderSettings, brightness: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-700 font-medium mb-1">
                    <span>Contraste ({darkReaderSettings.contrast}%)</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={darkReaderSettings.contrast}
                    onChange={e => setDarkReaderSettings({ ...darkReaderSettings, contrast: Number(e.target.value) })}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            )}

            {/* Game Speed Hack Settings */}
            {ext.id === 'game-speed-hack' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-700 font-medium">Velocidad de ejecución del juego:</div>
                <div className="flex gap-2">
                  {[0.5, 1.0, 2.0, 5.0, 10.0].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setGameSpeed(speed)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        gameSpeed === speed
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom extension script code */}
            {ext.isCustom && (
              <div className="space-y-2">
                <div className="text-xs text-gray-700 font-medium flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Código de usuario inyectado:</span>
                </div>
                <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-40">
                  {ext.settings.customJs || '// Sin script'}
                </pre>
              </div>
            )}
          </div>

          {/* Features and Capabilities */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Características Integradas
            </h3>
            <ul className="space-y-1.5">
              {ext.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Permisos del Navegador Escolar
            </h3>
            <div className="space-y-1.5 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              {ext.permissions.map((perm, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={() => {
              uninstallExtension(ext.id);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar extensión</span>
          </button>

          <button
            onClick={() => setInspectingExtension(null)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
