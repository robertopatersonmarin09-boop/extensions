import React, { useState } from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { X, Code2, Sparkles, Plus, Check } from 'lucide-react';
import { ExtensionCategory } from '../types/extension';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomExtensionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addCustomExtension } = useExtensions();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExtensionCategory>('productivity');
  const [customJs, setCustomJs] = useState(`// Código JavaScript inyectado
console.log("¡Mi extensión escolar personalizada está funcionando!");

// Ejemplo: Aumentar tamaño de fuentes o modificar comportamiento
// document.body.style.filter = "contrast(1.1)";
`);
  const [customCss, setCustomCss] = useState(`/* Estilos CSS personalizados */
.game-container {
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.4);
}
`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addCustomExtension({
      name: name.trim(),
      shortName: name.trim().slice(0, 15),
      version: '1.0.0',
      description: description.trim() || 'Extensión creada por el usuario para juegos escolares y proxies.',
      category,
      icon: 'code-2',
      author: 'Usuario Chromebook',
      settings: {
        customJs,
        customCss
      }
    });

    onClose();
  };

  const loadTemplate = (templateName: string) => {
    if (templateName === 'autoclicker') {
      setName('Mega Auto Clicker Escolar');
      setDescription('Genera clics continuos en juegos clicker y minijuegos.');
      setCategory('games_cheats');
      setCustomJs(`// Auto Clicker Script
let interval = null;
function startClicker() {
  const target = document.querySelector('button') || document.body;
  interval = setInterval(() => {
    target.click();
  }, 50);
}
startClicker();
`);
    } else if (templateName === 'neon') {
      setName('Tema Neón Escolar');
      setDescription('Añade un tema cyberpunk brillante a todos los juegos y proxies.');
      setCategory('productivity');
      setCustomCss(`/* Tema Neón */
body {
  filter: hue-rotate(45deg) saturate(1.2) !important;
}
`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Cargar Extensión Descomprimida</h2>
              <p className="text-xs text-gray-500">Crea tu propio plugin o userscript para tu web de juegos y proxies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Templates */}
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <span className="text-gray-500 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Plantillas rápidas:
            </span>
            <button
              type="button"
              onClick={() => loadTemplate('autoclicker')}
              className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 hover:bg-amber-100 font-medium cursor-pointer"
            >
              Auto Clicker
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('neon')}
              className="px-2.5 py-1 bg-purple-50 text-purple-800 rounded-lg border border-purple-200 hover:bg-purple-100 font-medium cursor-pointer"
            >
              Tema Neón
            </button>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Nombre de la extensión</label>
            <input
              type="text"
              required
              placeholder="Ej: Custom Speed & FPS Hack"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs cursor-pointer"
              >
                <option value="games_cheats">Juegos y Trucos</option>
                <option value="blockers">Bloqueadores</option>
                <option value="audio_video">Audio y Vídeo</option>
                <option value="stealth">Camuflaje</option>
                <option value="productivity">Productividad</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Descripción breve</label>
              <input
                type="text"
                placeholder="¿Qué hace esta extensión?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1 flex items-center justify-between">
              <span>Código JavaScript (Userscript)</span>
              <span className="text-[11px] text-gray-400 font-normal">Se ejecuta en el navegador proxy y juegos</span>
            </label>
            <textarea
              rows={5}
              value={customJs}
              onChange={e => setCustomJs(e.target.value)}
              className="w-full font-mono text-xs p-3 bg-gray-900 text-emerald-400 rounded-xl border border-gray-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Código CSS personalizado</label>
            <textarea
              rows={3}
              value={customCss}
              onChange={e => setCustomCss(e.target.value)}
              className="w-full font-mono text-xs p-3 bg-gray-900 text-cyan-400 rounded-xl border border-gray-800 focus:outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Instalar Extensión</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
