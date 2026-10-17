import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  FileCode2, 
  Code2, 
  Sparkles,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ProxyIntegrationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeIntegrationTab, setActiveIntegrationTab] = useState<'uv' | 'vanilla' | 'spotify'>('uv');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const uvCodeSnippet = `// 1. En tu archivo uv.config.js (Proxy Ultraviolet / Bare Server):
self.__uv$config = {
  prefix: '/service/',
  bare: 'https://bare.example.com/',
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/uv/uv.handler.js',
  client: '/uv/uv.client.js',
  bundle: '/uv/uv.bundle.js',
  config: '/uv/uv.config.js',
  sw: '/uv/uv.sw.js',
  
  // 🔥 AQUÍ SE CONECTAN TUS EXTENSIONES CON EL PROXY:
  inject: [
    {
      host: '.*', // Se inyecta en TODAS las webs abiertas en el proxy (Spotify, YouTube, etc.)
      html: \`<script>
        // Lee las extensiones activadas en el menú de tu página
        const extensionsData = JSON.parse(localStorage.getItem('chromebook_extensions_v2') || '[]');
        const isAdBlockActive = extensionsData.some(e => e.id === 'adblocker-ultra' && e.enabled);
        const volumeExt = extensionsData.find(e => e.id === 'volume-master' && e.enabled);
        
        if (isAdBlockActive) {
          // 1. Ocultar todos los banners y popups molestos
          const style = document.createElement('style');
          style.textContent = \`
            .ad, .ads, .ad-banner, .adsbygoogle, [id*="google_ads"],
            .ytp-ad-module, .ytp-ad-overlay-container,
            [data-testid="ad-container"], [aria-label="Publicidad"] {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
            }
          \`;
          document.head.appendChild(style);
          console.log("[Extensiones Hub] 🛡️ AdBlocker Ultra inyectado en el Proxy");
        }
      </script>\`
    }
  ]
};`;

  const spotifyCodeSnippet = `// Script específico para saltar anuncios en Spotify Web dentro del Proxy:
(function() {
  // Comprobar si uBlock Ultra está activado en tu página
  const activeExts = JSON.parse(localStorage.getItem('chromebook_extensions_v2') || '[]');
  const hasAdblock = activeExts.some(e => e.id === 'adblocker-ultra' && e.enabled);
  if (!hasAdblock) return;

  // Interceptar el reproductor de audio de Spotify
  setInterval(() => {
    // 1. Detectar si suena anuncio de Spotify
    const isAdPlaying = document.querySelector('[data-testid="ad-container"]') ||
                        document.title.includes('Spotify - Publicidad') ||
                        document.title.includes('Advertisement');
                        
    if (isAdPlaying) {
      const audioElements = document.querySelectorAll('audio, video');
      audioElements.forEach(media => {
        media.muted = true; // Silenciar anuncio
        media.currentTime = media.duration || 999; // Saltar directamente al final del anuncio
      });
      // Hacer clic automático en saltar si existe botón
      const skipBtn = document.querySelector('[data-testid="skip-button"]');
      if (skipBtn) skipBtn.click();
      console.log("🛡️ [Proxy] Anuncio de Spotify saltado automáticamente");
    }
  }, 300);
})();`;

  const vanillaIframeSnippet = `<!-- Si usas un iframe tradicional para tus juegos o páginas -->
<script>
  // Escucha cuando se activa una extensión en tu menú
  window.addEventListener('storage', (e) => {
    if (e.key === 'chromebook_extensions_v2') {
      const proxyIframe = document.getElementById('my-proxy-iframe');
      if (proxyIframe && proxyIframe.contentWindow) {
        // Enviar mensaje al proxy con la nueva configuración
        proxyIframe.contentWindow.postMessage({
          type: 'UPDATE_EXTENSIONS',
          data: JSON.parse(e.newValue)
        }, '*');
      }
    }
  });
</script>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                ¿Cómo bloqueará los anuncios en tu propio Proxy?
              </h2>
              <p className="text-xs text-gray-500">
                Respuesta técnica y código listo para pegar en tu página de juegos escolar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Direct Answer Alert Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs text-emerald-950 leading-relaxed">
              <strong className="text-sm font-bold block text-emerald-900 mb-1">
                ¡SÍ, PUEDE BLOQUEARLOS AL 100%! Pero necesitas conectar una línea en tu proxy.
              </strong>
              Cuando activas el AdBlocker en los ajustes de tu web, se guarda en el <code>localStorage</code> del navegador del Chromebook. Los proxies web modernos (como <strong>Ultraviolet</strong>, <strong>Rammerhead</strong> o <strong>Scramjet</strong>) tienen una opción llamada <code>inject</code> que permite inyectar automáticamente este script dentro de cualquier página (Spotify, YouTube, juegos) que el alumno abra en el proxy.
            </div>
          </div>

          {/* Integration Tabs */}
          <div>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2 text-xs font-semibold">
              <button
                onClick={() => setActiveIntegrationTab('uv')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeIntegrationTab === 'uv'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                1. Proxy Ultraviolet (uv.config.js)
              </button>
              <button
                onClick={() => setActiveIntegrationTab('spotify')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeIntegrationTab === 'spotify'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                2. Bypass Anuncios Spotify Web
              </button>
              <button
                onClick={() => setActiveIntegrationTab('vanilla')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeIntegrationTab === 'vanilla'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                3. Comunicación por Iframe
              </button>
            </div>

            {/* Code Snippets */}
            <div className="mt-3 relative">
              {activeIntegrationTab === 'uv' && (
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-500 font-medium">
                    <span>Añade la propiedad <code className="text-blue-600 font-bold">inject</code> a tu configuración del proxy:</span>
                    <button
                      onClick={() => copyToClipboard(uvCodeSnippet, 1)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                    >
                      {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 1 ? '¡Copiado!' : 'Copiar código'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-gray-100 font-mono text-xs rounded-xl overflow-x-auto max-h-64 border border-gray-800">
                    {uvCodeSnippet}
                  </pre>
                </div>
              )}

              {activeIntegrationTab === 'spotify' && (
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-500 font-medium">
                    <span>Cómo el AdBlocker silencia y salta anuncios de audio en Spotify Web:</span>
                    <button
                      onClick={() => copyToClipboard(spotifyCodeSnippet, 2)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                    >
                      {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 2 ? '¡Copiado!' : 'Copiar código'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-64 border border-gray-800">
                    {spotifyCodeSnippet}
                  </pre>
                </div>
              )}

              {activeIntegrationTab === 'vanilla' && (
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs text-gray-500 font-medium">
                    <span>Sincronizar cambios en tiempo real entre tus ajustes y el iframe:</span>
                    <button
                      onClick={() => copyToClipboard(vanillaIframeSnippet, 3)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold cursor-pointer"
                    >
                      {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === 3 ? '¡Copiado!' : 'Copiar código'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-gray-900 text-cyan-300 font-mono text-xs rounded-xl overflow-x-auto max-h-64 border border-gray-800">
                    {vanillaIframeSnippet}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Step by step summary */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Resumen en 3 pasos para tu página web:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-700 leading-relaxed">
              <li>
                <strong>Tus Ajustes:</strong> El usuario activa o desactiva la extensión (se guarda en <code>localStorage['chromebook_extensions_v2']</code>).
              </li>
              <li>
                <strong>Tu Proxy:</strong> En <code>uv.config.js</code>, el proxy inyecta el script que lee ese <code>localStorage</code>.
              </li>
              <li>
                <strong>En Spotify / YouTube:</strong> El script inyectado bloquea los banners con CSS y fuerza a los reproductores a saltarse las pistas de publicidad automáticamente.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Entendido, ¡gracias!
          </button>
        </div>
      </div>
    </div>
  );
};
