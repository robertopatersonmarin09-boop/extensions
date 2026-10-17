import { Extension } from '../types/extension';

export const DEFAULT_EXTENSIONS: Extension[] = [
  {
    id: 'screenity',
    name: 'Screenity - Graba y anota tu pantalla',
    shortName: 'Screenity',
    version: '3.4.1',
    description: 'La mejor grabadora de pantalla gratis para Chrome sin límites. Captura, dibuja, amplía, desenfoca, edita vídeos y mucho más, sin necesidad de registro y totalmente privada.',
    icon: 'screenity',
    iconGradient: 'from-blue-500 to-indigo-600',
    category: 'productivity',
    enabled: true,
    installed: true,
    author: 'Screenity Open Source',
    rating: 4.9,
    ratingCount: 14200,
    usersCount: '+2,000,000',
    permissions: [
      'Acceso a grabación de pantalla y canvas',
      'Inyección de herramientas de dibujo y pizarra',
      'Descarga directa de grabaciones WebM/MP4'
    ],
    features: [
      'Pincel y resaltador flotante en cualquier juego o página',
      'Grabación de pantalla sin límite de tiempo',
      'Modo borrador y puntero láser para clase',
      'Exportar capturas de pantalla instantáneas'
    ],
    settings: {}
  },
  {
    id: 'volume-master',
    name: 'Volume Master - controlador de volumen',
    shortName: 'Volume Master',
    version: '2.1.0',
    description: 'Hasta 600% de aumento de volumen. Controla el volumen de cualquier pestaña individual, amplifica altavoces silenciosos de Chromebook y refuerza los graves.',
    icon: 'volume-master',
    iconGradient: 'from-sky-400 to-blue-600',
    category: 'audio_video',
    enabled: true,
    installed: true,
    author: 'Volume Master Team',
    rating: 4.8,
    ratingCount: 38900,
    usersCount: '+5,000,000',
    permissions: [
      'Acceso a Web Audio API',
      'Modificación de ganancia de audio de pestaña',
      'Superación de límite de volumen estándar'
    ],
    features: [
      'Amplificación de hasta el 600%',
      'Control de volumen independiente por pestaña',
      'Refuerzo de graves (Bass Boost)',
      'Modo silencio rápido con 1 clic'
    ],
    settings: {
      volumeMultiplier: 250,
      bassBoost: true
    }
  },
  {
    id: 'adblocker-ultra',
    name: 'uBlock Ultra - Bloqueador de anuncios definitivo',
    shortName: 'uBlock Ultra',
    version: '1.56.0',
    description: 'Bloqueador eficiente y ligero para juegos escolares, Spotify Web y YouTube. Elimina anuncios publicitarios de audio, vídeos promocionales, pop-ups y rastreadores escolares.',
    icon: 'shield-alert',
    iconGradient: 'from-rose-500 to-red-600',
    category: 'blockers',
    enabled: true,
    installed: true,
    author: 'Raymond Hill & Com.',
    rating: 4.9,
    ratingCount: 95400,
    usersCount: '+10,000,000',
    permissions: [
      'Intercepción de peticiones de anuncios',
      'Bloqueo de banners publicitarios y popups en juegos',
      'Supresión de anuncios de audio en Spotify',
      'Saltado automático de anuncios en YouTube'
    ],
    features: [
      'Bloqueo automático de anuncios en Spotify Web',
      'Anti-publicidad en reproductores de vídeo y YouTube',
      'Eliminación de banners molestos en webs de juegos',
      'Contador de anuncios bloqueados en tiempo real',
      'Filtro de privacidad escolar'
    ],
    settings: {
      adsBlockedTotal: 247,
      popupsBlockedTotal: 38
    }
  },
  {
    id: 'dark-reader',
    name: 'Dark Reader - Modo oscuro para todas las webs',
    shortName: 'Dark Reader',
    version: '4.9.78',
    description: 'Invierte los colores brillantes de cualquier página o juego con alto contraste y tonos oscuros agradables a la vista. Ajusta brillo, contraste y filtro sepia.',
    icon: 'moon',
    iconGradient: 'from-purple-600 to-indigo-900',
    category: 'productivity',
    enabled: true,
    installed: true,
    author: 'Alexander Shutau',
    rating: 4.8,
    ratingCount: 52000,
    usersCount: '+5,000,000',
    permissions: [
      'Inyección de hojas de estilo CSS en tiempo real',
      'Filtros de brillo, contraste y luz azul'
    ],
    features: [
      'Modo oscuro forzado en juegos y proxies',
      'Slider de brillo y contraste',
      'Filtro sepia de descanso visual'
    ],
    settings: {
      darkReaderBrightness: 100,
      darkReaderContrast: 105,
      darkReaderSepia: 15
    }
  },
  {
    id: 'tab-cloak',
    name: 'Tab Cloak & Botón de Pánico Escolar',
    shortName: 'Tab Cloak',
    version: '2.0.4',
    description: 'Camufla al instante la pestaña y el título como Google Classroom, Google Drive o Wikipedia. Incluye tecla de emergencia rápida (Panic Key) para ocultar juegos cuando viene el profesor.',
    icon: 'ghost',
    iconGradient: 'from-emerald-500 to-teal-700',
    category: 'stealth',
    enabled: true,
    installed: true,
    author: 'School Stealth Labs',
    rating: 4.9,
    ratingCount: 18700,
    usersCount: '+800,000',
    permissions: [
      'Modificación de favicon y título del documento',
      'Detección de pulsación de teclas de emergencia (Esc / ~)',
      'Pantalla de camuflaje de documentos escolares'
    ],
    features: [
      'Disfraz instantáneo de Google Classroom / Drive',
      'Tecla rápida de pánico (por defecto: tecla Escape)',
      'Pantalla de trabajo falsa con apuntes escolares',
      'Silenciado instantáneo al activar pánico'
    ],
    settings: {
      panicHotkey: 'Escape',
      panicDisguise: 'classroom'
    }
  },
  {
    id: 'game-speed-hack',
    name: 'Game Speed Controller & Cheat Engine',
    shortName: 'Speed Controller',
    version: '1.8.2',
    description: 'Controla la velocidad de ejecución de cualquier juego HTML5 en el navegador. Ralentiza partes difíciles (0.5x cámara lenta) o acelera juegos lentos (2x, 5x, 10x).',
    icon: 'zap',
    iconGradient: 'from-amber-400 to-orange-600',
    category: 'games_cheats',
    enabled: true,
    installed: true,
    author: 'SpeedHack Studio',
    rating: 4.7,
    ratingCount: 11200,
    usersCount: '+600,000',
    permissions: [
      'Modificación de requestAnimationFrame y timers',
      'Control de framerate y velocidad de bucle de juego'
    ],
    features: [
      'Velocidad regulable: 0.5x, 1.0x, 2.0x, 5.0x, 10.0x',
      'Ideal para pasar niveles imposibles de juegos de plataformas',
      'Aceleración de progreso en juegos idle'
    ],
    settings: {
      gameSpeedMultiplier: 1.0
    }
  },
  {
    id: 'auto-clicker',
    name: 'Auto Clicker Pro para Juegos Escolares',
    shortName: 'Auto Clicker',
    version: '3.1.2',
    description: 'Genera clics automáticos ultra-rápidos (de 1 a 50 clics por segundo). Ideal para Cookie Clicker, juegos RPG y simuladores en clase.',
    icon: 'mouse-pointer-click',
    iconGradient: 'from-cyan-400 to-blue-600',
    category: 'games_cheats',
    enabled: false,
    installed: false,
    author: 'Clicker King',
    rating: 4.6,
    ratingCount: 8400,
    usersCount: '+450,000',
    permissions: [
      'Disparo de eventos MouseEvent sintéticos',
      'Atajos de teclado para inicio/pausa de clics'
    ],
    features: [
      'Velocidad de hasta 50 clics/segundo',
      'Atajo de inicio rápido',
      'Objetivo automático en botón de juego'
    ],
    settings: {
      autoClickerCps: 15,
      autoClickerActive: false
    }
  },
  {
    id: 'tampermonkey-lite',
    name: 'Tampermonkey Lite - Gestor de Scripts',
    shortName: 'Tampermonkey',
    version: '5.2.0',
    description: 'Inyecta scripts personalizados de JavaScript y estilos CSS en juegos y proxies escolares. Permite añadir hacks caseros, cambiar fondos o desbloquear funciones.',
    icon: 'code-2',
    iconGradient: 'from-slate-700 to-gray-900',
    category: 'productivity',
    enabled: false,
    installed: false,
    author: 'Jan Biniok',
    rating: 4.9,
    ratingCount: 68000,
    usersCount: '+10,000,000',
    permissions: [
      'Inyección directa de scripts de usuario',
      'Manipulación del árbol DOM'
    ],
    features: [
      'Editor de código integrado con resaltado de sintaxis',
      'Carga de scripts para juegos específicos',
      'Inyección de trucos caseros y estilos CSS'
    ],
    settings: {
      customJs: '// Script de prueba\nconsole.log("¡Extensión escolar activada!");',
      customCss: '/* Inyecta estilos personalizados */'
    }
  },
  {
    id: 'pip-video',
    name: 'Picture-in-Picture & Mini Reproductor',
    shortName: 'PiP Player',
    version: '1.4.0',
    description: 'Permite reproducir vídeos y música en una ventana flotante fija en la esquina mientras juegas o estás en otra pestaña escolar.',
    icon: 'picture-in-picture',
    iconGradient: 'from-fuchsia-500 to-pink-600',
    category: 'audio_video',
    enabled: false,
    installed: false,
    author: 'Floating Media Devs',
    rating: 4.7,
    ratingCount: 9300,
    usersCount: '+1,200,000',
    permissions: [
      'Acceso a API Picture-in-Picture',
      'Ventana siempre visible por encima del navegador'
    ],
    features: [
      'Ventana flotante redimensionable',
      'Reproduce música en segundo plano mientras juegas',
      'Controles de avance y pausa rápida'
    ],
    settings: {}
  }
];
