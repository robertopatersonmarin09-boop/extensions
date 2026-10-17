import React from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { 
  Folder, 
  FileText, 
  BookOpen, 
  User, 
  Search, 
  Grid, 
  MoreVertical, 
  Clock, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

export const PanicCloakOverlay: React.FC = () => {
  const { panicModeActive, setPanicModeActive, panicDisguise } = useExtensions();

  if (!panicModeActive) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-white text-gray-800 flex flex-col font-sans select-none overflow-y-auto"
      onDoubleClick={() => setPanicModeActive(false)}
    >
      {/* Subtle exit helper floating in bottom right */}
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setPanicModeActive(false)}
          className="opacity-20 hover:opacity-100 transition-opacity px-3 py-1 bg-black text-white text-xs rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer"
        >
          <span>Salir de camuflaje (Esc)</span>
          <X className="w-3 h-3" />
        </button>
      </div>

      {panicDisguise === 'classroom' && (
        <div className="min-h-full flex flex-col bg-gray-50">
          {/* Google Classroom Navbar */}
          <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <div className="w-5 h-4 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                  <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                  <span className="w-full h-0.5 bg-gray-600 rounded"></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center text-white font-bold text-sm">
                  C
                </div>
                <span className="text-lg font-medium text-gray-700">Google Classroom</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 hover:bg-gray-100 rounded-full text-gray-600 cursor-pointer">
                <Grid className="w-5 h-5" />
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
            </div>
          </header>

          {/* Classroom Subnav */}
          <div className="bg-white border-b border-gray-200 px-8 flex items-center gap-8 text-sm font-medium text-gray-600">
            <button className="py-3 text-emerald-700 border-b-2 border-emerald-700 font-semibold">
              Pendientes
            </button>
            <button className="py-3 hover:text-gray-900">
              Completadas
            </button>
          </div>

          {/* Classes Cards Grid */}
          <main className="p-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Tareas asignadas para esta semana
              </h2>
              <span className="text-xs text-gray-400">Actualizado hace 5 minutos</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class 1 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="bg-linear-to-r from-emerald-600 to-teal-700 p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">Matemáticas 3º ESO</h3>
                      <p className="text-xs text-emerald-100 mt-0.5">Prof. M. García • Aula 204</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-emerald-200" />
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Próxima entrega:</div>
                  <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium text-gray-800">Ejercicios 14 a 22 - Polinomios y factorización</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">Fecha límite: Mañana 14:00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class 2 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">Lengua y Literatura</h3>
                      <p className="text-xs text-blue-100 mt-0.5">Dpto. Humanidades</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-blue-200" />
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Próxima entrega:</div>
                  <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium text-gray-800">Comentario de texto poético: Generación del 27</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">Fecha límite: Viernes</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class 3 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="bg-linear-to-r from-purple-600 to-pink-700 p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">Física y Química</h3>
                      <p className="text-xs text-purple-100 mt-0.5">Laboratorio de Ciencias</p>
                    </div>
                    <MoreVertical className="w-4 h-4 text-purple-200" />
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <div className="text-xs font-semibold text-gray-500 mb-2">Próxima entrega:</div>
                  <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <BookOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-medium text-gray-800">Informe de Práctica: Tabla periódica y enlaces</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">En progreso</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {panicDisguise === 'docs' && (
        <div className="min-h-full flex flex-col bg-gray-100">
          <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-base font-semibold text-gray-800">Ensayo Historia Contemporánea - La Revolución Industrial.docx</h1>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>Archivo</span>
                  <span>Editar</span>
                  <span>Ver</span>
                  <span>Insertar</span>
                  <span>Formato</span>
                  <span>Herramientas</span>
                  <span className="text-gray-400">Guardado en Drive</span>
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 p-8 flex justify-center">
            <div className="w-full max-w-3xl bg-white shadow-md min-h-[700px] p-12 font-serif text-sm leading-relaxed text-gray-800 border border-gray-200">
              <h1 className="text-xl font-bold mb-4 font-sans text-center">La Revolución Industrial y la Transformación Económica del Siglo XVIII</h1>
              <p className="mb-4">
                La Revolución Industrial fue un proceso de profundas transformaciones económicas, sociales, culturales y tecnológicas que se desarrolló entre 1760 y 1840, y tuvo su origen en Gran Bretaña. Marcó un punto de inflexión en la historia, modificando e influenciando todos los aspectos de la vida cotidiana de una u otra manera.
              </p>
              <p className="mb-4">
                El motor principal de este cambio fue la aplicación de la máquina de vapor inventada por James Watt, la cual revolucionó no solo la producción manufacturera y textil sino también los transportes mediante el ferrocarril y los barcos de vapor.
              </p>
              <h2 className="text-base font-bold mt-6 mb-2 font-sans">1. Antecedentes Agrícolas y Demográficos</h2>
              <p>
                Durante el siglo XVIII se produjo un incremento notable en la productividad agraria gracias a nuevas técnicas de rotación de cultivos como el sistema Norfolk, lo cual redujo la necesidad de mano de obra en el campo e impulsó una gran migración hacia las ciudades industriales emergentes como Manchester, Birmingham y Leeds.
              </p>
            </div>
          </div>
        </div>
      )}

      {(panicDisguise === 'drive' || panicDisguise === 'wikipedia') && (
        <div className="min-h-full flex flex-col bg-white p-8 max-w-4xl mx-auto">
          <div className="border-b pb-4 mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Wikipedia: Cálculo Infinitesimal</h1>
            <span className="text-xs text-gray-500">De Wikipedia, la enciclopedia libre</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            El cálculo infinitesimal o simplemente cálculo constituye una rama muy importante de las matemáticas modernas. Desprende de dos campos principales: el cálculo diferencial y el cálculo integral, que están unidos por el teorema fundamental del cálculo.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs font-mono mb-4">
            f'(x) = lim (h -&gt; 0) [f(x + h) - f(x)] / h
          </div>
          <p className="text-sm leading-relaxed">
            Fue desarrollado de manera independiente por Isaac Newton y Gottfried Wilhelm Leibniz a finales del siglo XVII.
          </p>
        </div>
      )}
    </div>
  );
};
