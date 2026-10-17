import React, { useState, useEffect, useRef } from 'react';
import { useExtensions } from '../context/ExtensionContext';
import { 
  Music, 
  Gamepad2, 
  Globe, 
  Youtube, 
  ShieldAlert, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Puzzle, 
  Zap, 
  Ghost, 
  Sliders, 
  SlidersHorizontal,
  Sparkles,
  ExternalLink,
  Flame,
  AlertTriangle,
  Cookie,
  Target,
  Terminal,
  BookOpen,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ProxyIntegrationModal } from './ProxyIntegrationModal';

export const BrowserProxyHub: React.FC = () => {
  const {
    extensions,
    isExtensionActive,
    volumeMultiplier,
    setVolumeMultiplier,
    bassBoost,
    adsBlockedCount,
    incrementAdsBlocked,
    triggerPanic,
    screenityDrawingActive,
    setScreenityDrawingActive,
    gameSpeed,
    setGameSpeed,
    darkReaderActive,
    darkReaderSettings,
    toggleExtension
  } = useExtensions();

  const [activeSubTab, setActiveSubTab] = useState<'spotify' | 'games' | 'youtube' | 'proxy'>('spotify');
  const [proxyUrl, setProxyUrl] = useState('https://spotify-unblocked.proxy/webplayer');
  const [puzzleMenuOpen, setPuzzleMenuOpen] = useState(false);
  const [proxyModalOpen, setProxyModalOpen] = useState(false);

  // ==========================================
  // SPOTIFY SIMULATOR WITH REAL WEB AUDIO & AD-BLOCKER
  // ==========================================
  const tracks = [
    { id: 1, title: 'Lo-Fi Chill Beats for School', artist: 'Classroom Relax', duration: 184, bpm: 80, cover: '🎵' },
    { id: 2, title: 'Synthwave Odyssey (Chromebook Mix)', artist: 'Cyber Arcade', duration: 210, bpm: 110, cover: '🌌' },
    { id: 3, title: 'Midnight Study Session', artist: 'Quiet Library', duration: 165, bpm: 75, cover: '🌙' },
    { id: 4, title: '8-Bit Victory Chiptune', artist: 'Pixel Master', duration: 140, bpm: 128, cover: '👾' }
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(25);
  const [spotifyAdTriggered, setSpotifyAdTriggered] = useState(false);
  const [adBlockedAlert, setAdBlockedAlert] = useState<string | null>(null);

  // Web Audio Context for playing authentic musical synth beats
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<any>(null);

  const startSynthBeat = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Schedule simple periodic melodic chord pulses
      clearInterval(synthTimerRef.current);
      let step = 0;
      const chords = [
        [261.63, 329.63, 392.00], // C major
        [220.00, 261.63, 329.63], // A minor
        [174.61, 220.00, 261.63], // F major
        [196.00, 246.94, 293.66]  // G major
      ];

      synthTimerRef.current = setInterval(() => {
        if (!ctx) return;
        const chord = chords[step % chords.length];
        step++;

        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          // Apply Volume Master multiplier! (e.g. 250% => 2.5x gain)
          const baseGain = 0.04;
          const boostFactor = (volumeMultiplier / 100);
          gain.gain.setValueAtTime(baseGain * boostFactor, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

          osc.type = bassBoost ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.65);
        });
      }, 700);
    } catch {
      // Audio autoplay policy
    }
  };

  const stopSynthBeat = () => {
    clearInterval(synthTimerRef.current);
  };

  // Handle Play/Pause
  const togglePlayMusic = () => {
    const willPlay = !isPlaying;
    setIsPlaying(willPlay);

    if (willPlay) {
      // Check if AdBlocker is active or inactive
      const isAdBlockerActive = isExtensionActive('adblocker-ultra');

      if (!isAdBlockerActive) {
        // Without adblocker, show annoying ad!
        setSpotifyAdTriggered(true);
        stopSynthBeat();
      } else {
        // With adblocker, suppress ad and play cleanly!
        setSpotifyAdTriggered(false);
        setAdBlockedAlert('🛡️ uBlock Ultra: Anuncio de audio y banner de Spotify bloqueados con éxito (+1)');
        incrementAdsBlocked(1);
        startSynthBeat();
        setTimeout(() => setAdBlockedAlert(null), 4000);
      }
    } else {
      stopSynthBeat();
      setSpotifyAdTriggered(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    setTrackProgress(0);

    const isAdBlockerActive = isExtensionActive('adblocker-ultra');
    if (!isAdBlockerActive) {
      setSpotifyAdTriggered(true);
      stopSynthBeat();
      setIsPlaying(false);
    } else {
      incrementAdsBlocked(1);
      setAdBlockedAlert('🛡️ uBlock Ultra: Anuncio de transición de pista bloqueado (+1)');
      setTimeout(() => setAdBlockedAlert(null), 3500);
      if (isPlaying) {
        startSynthBeat();
      }
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSynthBeat();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Update URL bar when switching subtabs
  const handleTabChange = (tab: 'spotify' | 'games' | 'youtube' | 'proxy') => {
    setActiveSubTab(tab);
    if (tab === 'spotify') setProxyUrl('https://spotify-unblocked.proxy/webplayer');
    if (tab === 'games') setProxyUrl('https://chromebook-games.proxy/arcade');
    if (tab === 'youtube') setProxyUrl('https://youtube-clean.proxy/watch');
    if (tab === 'proxy') setProxyUrl('https://fast-proxy-school.net/surf');
  };

  // ==========================================
  // UNBLOCKED GAMES: CYBER RUNNER & COOKIE CLICKER
  // ==========================================
  const [cookieCount, setCookieCount] = useState(0);
  const [runnerJumping, setRunnerJumping] = useState(false);
  const [runnerScore, setRunnerScore] = useState(0);
  const [runnerGameOver, setRunnerGameOver] = useState(false);
  const [obstaclePos, setObstaclePos] = useState(100); // 0 to 100%

  // Auto clicker integration
  useEffect(() => {
    let clickerTimer: any;
    const isAutoClickerActive = isExtensionActive('auto-clicker');
    if (isAutoClickerActive && activeSubTab === 'games') {
      clickerTimer = setInterval(() => {
        setCookieCount(c => c + 1);
      }, 70); // ~14 clicks per sec
    }
    return () => clearInterval(clickerTimer);
  }, [isExtensionActive('auto-clicker'), activeSubTab]);

  // Cyber Runner Loop (affected by Game Speed Hack!)
  useEffect(() => {
    if (activeSubTab !== 'games' || runnerGameOver) return;

    // Speed multiplier from extension: 0.5x, 1x, 2x, etc.
    const stepInterval = Math.max(10, Math.floor(40 / (gameSpeed || 1)));

    const loop = setInterval(() => {
      setObstaclePos(prev => {
        if (prev <= 12 && prev >= 0 && !runnerJumping) {
          setRunnerGameOver(true);
          return 100;
        }
        if (prev <= 0) {
          setRunnerScore(s => s + 10);
          return 100;
        }
        return prev - 2;
      });
    }, stepInterval);

    return () => clearInterval(loop);
  }, [activeSubTab, runnerGameOver, runnerJumping, gameSpeed]);

  const jumpRunner = () => {
    if (runnerGameOver) {
      setRunnerGameOver(false);
      setRunnerScore(0);
      setObstaclePos(100);
      return;
    }
    if (!runnerJumping) {
      setRunnerJumping(true);
      setTimeout(() => setRunnerJumping(false), 550 / (gameSpeed || 1));
    }
  };

  // ==========================================
  // YOUTUBE CLEAN SIMULATOR
  // ==========================================
  const [youtubeAdActive, setYoutubeAdActive] = useState(false);
  const [youtubePlaying, setYoutubePlaying] = useState(false);

  const startYoutubeVideo = () => {
    const isAdBlockerActive = isExtensionActive('adblocker-ultra');
    setYoutubePlaying(true);
    if (!isAdBlockerActive) {
      setYoutubeAdActive(true);
    } else {
      setYoutubeAdActive(false);
      incrementAdsBlocked(1);
      setAdBlockedAlert('🛡️ uBlock Ultra: Anuncio previo de YouTube (15s) saltado al instante (+1)');
      setTimeout(() => setAdBlockedAlert(null), 4000);
    }
  };

  return (
    <div 
      className={`min-h-full pb-16 transition-all duration-300 ${
        darkReaderActive ? 'bg-gray-950 text-gray-100' : 'bg-gray-100 text-gray-800'
      }`}
      style={
        darkReaderActive
          ? {
              filter: `brightness(${darkReaderSettings.brightness}%) contrast(${darkReaderSettings.contrast}%) sepia(${darkReaderSettings.sepia}%)`
            }
          : {}
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Ad Blocked Alert Notification Toast */}
        {adBlockedAlert && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-200 border border-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>{adBlockedAlert}</span>
          </div>
        )}

        {/* Chrome Browser Window Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-300/80 overflow-hidden flex flex-col min-h-[750px]">
          {/* Top Browser Header & Tab Strip */}
          <div className="bg-gray-200/90 border-b border-gray-300 px-3 pt-2 flex items-center justify-between gap-2">
            {/* Tabs matching Chrome */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
              {[
                { id: 'spotify', label: 'Spotify Web Player', icon: Music, badge: isExtensionActive('adblocker-ultra') ? '🛡️ Sin Anuncios' : '⚠️ Anuncios ON' },
                { id: 'games', label: 'Juegos Desbloqueados', icon: Gamepad2, badge: `${gameSpeed}x Speed` },
                { id: 'youtube', label: 'YouTube Clean', icon: Youtube, badge: 'SponsorBlock' },
                { id: 'proxy', label: 'Navegador Web Sandbox', icon: Globe, badge: 'Proxy' }
              ].map(t => {
                const Icon = t.icon;
                const isSelected = activeSubTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-t-xl transition-all cursor-pointer select-none text-xs ${
                      isSelected
                        ? 'bg-white text-gray-900 font-semibold shadow-xs border-t-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-300/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-gray-100 text-gray-500 font-mono">
                      {t.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-gray-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Proxy Activo
              </span>
            </div>
          </div>

          {/* Chrome URL Address Bar & Extension Action Toolbar */}
          <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between gap-3">
            {/* Back, Forward, Reload */}
            <div className="flex items-center gap-1 text-gray-500">
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400">
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  if (activeSubTab === 'spotify' && isPlaying) {
                    stopSynthBeat();
                    startSynthBeat();
                  }
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600"
                title="Recargar página del proxy"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* URL Input */}
            <div className="flex-1 max-w-2xl flex items-center gap-2 bg-gray-100 hover:bg-gray-100/90 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs text-gray-700">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <input
                type="text"
                value={proxyUrl}
                onChange={e => setProxyUrl(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-hidden font-mono text-[11px]"
              />
              <span className="text-[10px] text-gray-400 font-mono shrink-0">Chromebook Sandbox</span>
            </div>

            {/* Chrome Extensions Toolbar Icons (The authentic 🧩 puzzle menu!) */}
            <div className="flex items-center gap-2 relative">
              {/* Quick Volume Master icon */}
              {isExtensionActive('volume-master') && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold border border-blue-200">
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{volumeMultiplier}%</span>
                </div>
              )}

              {/* Quick AdBlocker icon */}
              {isExtensionActive('adblocker-ultra') && (
                <div className="flex items-center gap-1 bg-rose-50 text-rose-700 px-2 py-1 rounded-lg text-xs font-bold border border-rose-200" title="Anuncios bloqueados">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  <span>{adsBlockedCount}</span>
                </div>
              )}

              {/* Screenity Draw Quick Trigger */}
              {isExtensionActive('screenity') && (
                <button
                  onClick={() => setScreenityDrawingActive(!screenityDrawingActive)}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    screenityDrawingActive 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
                  }`}
                  title="Activar lápiz y pizarra Screenity"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              )}

              {/* Panic Cloak Quick Trigger */}
              <button
                onClick={triggerPanic}
                className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                title="Botón de Pánico escolar (o tecla Esc)"
              >
                <Ghost className="w-4 h-4" />
              </button>

              {/* Extension Puzzle Piece Button (🧩) */}
              <button
                onClick={() => setPuzzleMenuOpen(!puzzleMenuOpen)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer relative ${
                  puzzleMenuOpen 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                }`}
                title="Menú de extensiones de Chrome"
              >
                <Puzzle className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Puzzle Popup Dropdown (Chrome Toolbar Extension Popup) */}
              {puzzleMenuOpen && (
                <div className="absolute right-0 top-10 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 font-bold text-gray-800 text-sm">
                      <Puzzle className="w-4 h-4 text-blue-600" />
                      <span>Extensiones en esta página</span>
                    </div>
                    <button
                      onClick={() => setPuzzleMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 mt-2 space-y-2">
                    {/* uBlock Ultra quick control */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span className="font-semibold text-gray-800">uBlock Ultra</span>
                        </div>
                        <button
                          onClick={() => toggleExtension('adblocker-ultra')}
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer ${
                            isExtensionActive('adblocker-ultra')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isExtensionActive('adblocker-ultra') ? 'ACTIVO' : 'PAUSADO'}
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 flex justify-between">
                        <span>Anuncios bloqueados:</span>
                        <span className="font-bold text-rose-600">{adsBlockedCount}</span>
                      </div>
                    </div>

                    {/* Volume Master quick control */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-800">Volume Master</span>
                        </div>
                        <span className="font-bold text-blue-600">{volumeMultiplier}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="600"
                        step="10"
                        value={volumeMultiplier}
                        onChange={e => setVolumeMultiplier(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-1.5"
                      />
                    </div>

                    {/* Game Speed Hack */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="font-semibold text-gray-800">Velocidad Juegos</span>
                        </div>
                        <span className="font-bold text-amber-600">{gameSpeed}x</span>
                      </div>
                      <div className="flex gap-1.5">
                        {[0.5, 1.0, 2.0, 5.0].map(s => (
                          <button
                            key={s}
                            onClick={() => setGameSpeed(s)}
                            className={`flex-1 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                              gameSpeed === s ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dark Reader switch */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">Modo Oscuro Forzado</span>
                      <button
                        onClick={() => toggleExtension('dark-reader')}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] cursor-pointer ${
                          darkReaderActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {darkReaderActive ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Browser Workspace Content */}
          <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
            {/* ======================================================= */}
            {/* VIEW 1: SPOTIFY WEB PLAYER SIMULATOR (USER KEY FEATURE) */}
            {/* ======================================================= */}
            {activeSubTab === 'spotify' && (
              <div className="flex-1 flex flex-col bg-[#121212] text-white">
                {/* Spotify Banner Explaining AdBlocker Functionality */}
                <div className="bg-[#181818] border-b border-[#282828] px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1db954] flex items-center justify-center text-black font-bold text-sm">
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Spotify Web Player en Chromebook</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#282828] text-gray-300">Proxy Escolar</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {isExtensionActive('adblocker-ultra')
                          ? '✅ uBlock Ultra está ACTIVO: No escucharás ni verás anuncios en Spotify.'
                          : '⚠️ uBlock Ultra está DESACTIVADO: Aparecerán anuncios molestos entre canciones.'}
                      </div>
                    </div>
                  </div>

                  {/* Toggle uBlock Ultra button right here for instant test! */}
                  <button
                    onClick={() => toggleExtension('adblocker-ultra')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isExtensionActive('adblocker-ultra')
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                        : 'bg-[#1db954] hover:bg-[#1ed760] text-black shadow-xs'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isExtensionActive('adblocker-ultra') ? 'Desactivar AdBlocker (Ver Anuncios)' : 'Activar AdBlocker (Bloquear Anuncios)'}</span>
                  </button>
                </div>

                {/* Spotify Main Content */}
                <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
                  {/* ANNOYING AD OVERLAY WHEN ADBLOCKER IS OFF */}
                  {spotifyAdTriggered && !isExtensionActive('adblocker-ultra') ? (
                    <div className="bg-linear-to-r from-red-950 via-rose-900 to-red-900 border-2 border-red-500 rounded-2xl p-6 my-auto text-center shadow-2xl animate-in zoom-in-95 duration-200 max-w-lg mx-auto">
                      <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md animate-bounce">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-red-300 bg-red-900/60 px-3 py-1 rounded-full">
                        Publicidad de Audio Spotify (30 seg)
                      </span>
                      <h3 className="text-xl font-extrabold mt-3 text-white">
                        ¡Cámbiate a Spotify Premium por 9.99€!
                      </h3>
                      <p className="text-xs text-red-200 mt-2 max-w-sm mx-auto leading-relaxed">
                        Este anuncio aparece porque <strong>uBlock Ultra</strong> está desactivado. Actívalo en el menú de extensiones para que nunca más vuelva a interrumpirte la música en clase.
                      </p>

                      <div className="mt-5 flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            toggleExtension('adblocker-ultra', true);
                            setSpotifyAdTriggered(false);
                            setIsPlaying(true);
                            startSynthBeat();
                          }}
                          className="px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-full font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          🛡️ Activar uBlock y Eliminar este Anuncio
                        </button>
                        <button
                          onClick={() => {
                            setSpotifyAdTriggered(false);
                            setIsPlaying(true);
                            startSynthBeat();
                          }}
                          className="px-4 py-2.5 bg-red-800/80 hover:bg-red-800 text-white rounded-full text-xs font-semibold cursor-pointer"
                        >
                          Esperar y omitir
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL PLAYLIST & TRACK VIEW */
                    <div className="space-y-6">
                      {/* Album Header */}
                      <div className="flex items-end gap-6 bg-linear-to-b from-blue-900/50 to-transparent p-6 rounded-2xl">
                        <div className="w-36 h-36 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl shadow-2xl flex items-center justify-center text-5xl shrink-0">
                          {tracks[currentTrackIndex].cover}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Playlist de Clase</span>
                          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                            Estudio sin Distracciones
                          </h1>
                          <p className="text-xs text-gray-300 mt-2">
                            Música de concentración optimizada para Chromebooks escolares • Volumen amplificable al 600%
                          </p>
                        </div>
                      </div>

                      {/* Song List */}
                      <div className="space-y-1">
                        {tracks.map((t, idx) => {
                          const isCurrent = idx === currentTrackIndex;
                          return (
                            <div
                              key={t.id}
                              onClick={() => {
                                setCurrentTrackIndex(idx);
                                if (!isPlaying) togglePlayMusic();
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-xs ${
                                isCurrent ? 'bg-[#282828] text-[#1db954]' : 'hover:bg-[#181818] text-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-5 text-center text-gray-500 font-mono">
                                  {isCurrent && isPlaying ? '▶' : idx + 1}
                                </span>
                                <div>
                                  <div className={`font-semibold ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                                    {t.title}
                                  </div>
                                  <div className="text-[11px] text-gray-500">{t.artist}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-gray-400">
                                <span className="font-mono">
                                  {Math.floor(t.duration / 60)}:{Math.floor(t.duration % 60).toString().padStart(2, '0')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Spotify Bottom Playback Bar */}
                <div className="bg-[#181818] border-t border-[#282828] p-4 px-6 flex items-center justify-between gap-4">
                  {/* Current Playing Info */}
                  <div className="flex items-center gap-3 min-w-[180px]">
                    <div className="w-12 h-12 bg-[#282828] rounded-lg flex items-center justify-center text-xl shrink-0">
                      {tracks[currentTrackIndex].cover}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white truncate">{tracks[currentTrackIndex].title}</div>
                      <div className="text-[11px] text-gray-400 truncate">{tracks[currentTrackIndex].artist}</div>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex flex-col items-center gap-2 max-w-md w-full">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button
                        onClick={togglePlayMusic}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-md"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                      </button>
                      <button
                        onClick={nextTrack}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-full flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <span>0:45</span>
                      <div className="flex-1 h-1 bg-[#404040] rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '35%' }} />
                      </div>
                      <span>3:04</span>
                    </div>
                  </div>

                  {/* Volume Control showing Volume Master Booster */}
                  <div className="flex items-center gap-2 min-w-[160px] justify-end">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="80"
                      className="w-20 accent-[#1db954] cursor-pointer h-1"
                    />
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                      x{(volumeMultiplier / 100).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* VIEW 2: UNBLOCKED HTML5 GAMES (SPEED HACK & AUTOCLICKER) */}
            {/* ======================================================= */}
            {activeSubTab === 'games' && (
              <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900 text-white overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-amber-400" />
                      <span>Juegos Desbloqueados para Clase</span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Usa el <strong>Game Speed Controller</strong> para ralentizar/acelerar el juego o <strong>Auto Clicker</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-amber-300 font-semibold bg-amber-950/80 border border-amber-700/60 px-2.5 py-1 rounded-lg">
                      ⚡ Velocidad: {gameSpeed}x
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {/* Game 1: Cyber Runner (Affected by Game Speed!) */}
                  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-cyan-400">Cyber Runner 2048</span>
                        <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-400 font-bold">
                          Puntuación: {runnerScore}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">
                        Haz clic o pulsa para saltar los pinchos. Si te resulta difícil, pon la velocidad a <strong>0.5x</strong> en la extensión.
                      </p>
                    </div>

                    {/* Canvas / Game Arena */}
                    <div 
                      onClick={jumpRunner}
                      className="relative h-44 bg-linear-to-b from-slate-950 to-indigo-950 rounded-xl overflow-hidden border border-slate-700 flex flex-col justify-end p-4 cursor-pointer select-none group"
                    >
                      {/* Runner Player */}
                      <div 
                        className={`absolute left-8 w-8 h-8 rounded-lg bg-cyan-400 shadow-lg shadow-cyan-500/50 flex items-center justify-center font-bold text-slate-900 text-xs transition-all duration-200 ${
                          runnerJumping ? 'bottom-20 rotate-45' : 'bottom-4'
                        }`}
                      >
                        ▲
                      </div>

                      {/* Moving Obstacle */}
                      <div 
                        className="absolute bottom-4 w-6 h-10 bg-rose-500 rounded-t-md shadow-md shadow-rose-500/50"
                        style={{ left: `${obstaclePos}%` }}
                      />

                      {/* Ground line */}
                      <div className="w-full h-1 bg-cyan-500/40 rounded-full" />

                      {runnerGameOver && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                          <span className="text-rose-500 font-bold text-base mb-1">¡GAME OVER!</span>
                          <span className="text-xs text-slate-300 mb-3">Puntuación final: {runnerScore}</span>
                          <button
                            onClick={jumpRunner}
                            className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Volver a Jugar
                          </button>
                        </div>
                      )}

                      {!runnerGameOver && (
                        <div className="absolute top-2 right-2 text-[10px] text-cyan-300 bg-slate-900/60 px-2 py-0.5 rounded">
                          Haz clic para saltar
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Control de velocidad:</span>
                      <div className="flex gap-1.5">
                        {[0.5, 1.0, 2.0].map(s => (
                          <button
                            key={s}
                            onClick={() => setGameSpeed(s)}
                            className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                              gameSpeed === s ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Game 2: Cookie Clicker Escolar (Affected by Auto Clicker!) */}
                  <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                          <Cookie className="w-4 h-4" />
                          <span>Cookie Clicker Chromebook</span>
                        </span>
                        <span className="text-xs font-mono bg-slate-900 px-2.5 py-1 rounded text-amber-300 font-bold">
                          {cookieCount} Galletas
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-3">
                        Activa la extensión <strong>Auto Clicker Pro</strong> para farmear galletas automáticamente a máxima velocidad.
                      </p>
                    </div>

                    {/* Giant Clickable Cookie */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <button
                        onClick={() => setCookieCount(c => c + 1)}
                        className="w-32 h-32 rounded-full bg-linear-to-br from-amber-600 via-amber-700 to-amber-900 border-4 border-amber-500/60 shadow-2xl shadow-amber-600/30 flex items-center justify-center text-6xl hover:scale-105 active:scale-95 transition-transform cursor-pointer relative group select-none"
                      >
                        🍪
                        {isExtensionActive('auto-clicker') && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black animate-pulse">
                            AUTO ON
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-700">
                      <div className="text-[11px] text-slate-400">
                        {isExtensionActive('auto-clicker') ? '⚡ Farmeando a 15 CPS' : 'Manual (1 clic)'}
                      </div>
                      <button
                        onClick={() => toggleExtension('auto-clicker')}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                          isExtensionActive('auto-clicker')
                            ? 'bg-rose-600 hover:bg-rose-700 text-white'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        }`}
                      >
                        {isExtensionActive('auto-clicker') ? 'Detener Auto Clicker' : 'Activar Auto Clicker'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* VIEW 3: YOUTUBE CLEAN SIMULATOR (AD-SKIPPER & SPONSORBLOCK) */}
            {/* ======================================================= */}
            {activeSubTab === 'youtube' && (
              <div className="flex-1 p-6 flex flex-col bg-gray-900 text-white overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full space-y-4">
                  {/* Video Player */}
                  <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
                    {/* Simulated Pre-roll Ad if AdBlocker is OFF */}
                    {youtubeAdActive && !isExtensionActive('adblocker-ultra') ? (
                      <div className="absolute inset-0 bg-yellow-950/90 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
                        <span className="px-2.5 py-0.5 rounded bg-yellow-400 text-black text-xs font-black uppercase mb-2">
                          Anuncio de YouTube (15s)
                        </span>
                        <h3 className="text-lg font-bold text-white">Publicidad sin bloquear</h3>
                        <p className="text-xs text-yellow-200 mt-1 max-w-sm">
                          Con <strong>uBlock Ultra</strong> activado, este anuncio se salta a 0 segundos sin interrupciones.
                        </p>
                        <button
                          onClick={() => {
                            toggleExtension('adblocker-ultra', true);
                            setYoutubeAdActive(false);
                          }}
                          className="mt-4 px-4 py-2 bg-white text-black font-bold text-xs rounded-full cursor-pointer hover:bg-gray-100"
                        >
                          🛡️ Activar uBlock y Saltar Anuncio
                        </button>
                      </div>
                    ) : (
                      /* Clean Video Content */
                      <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-900 to-black p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl shadow-lg mb-3">
                          <Youtube className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-white">
                          Tutorial: Trucos y Desbloqueos en Chromebooks
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Reproducción limpia sin publicidad gracias a uBlock Ultra & SponsorBlock
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={startYoutubeVideo}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md"
                          >
                            {youtubePlaying ? 'Reiniciar Vídeo' : 'Reproducir Vídeo'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Meta */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h2 className="text-base font-bold text-white">
                        Cómo saltar filtros de red y optimizar tu Chromebook en 2026
                      </h2>
                      <div className="text-xs text-gray-400 mt-0.5">142,500 visualizaciones • Hace 2 días</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-gray-800 text-xs font-medium text-emerald-400 flex items-center gap-1.5 border border-gray-700">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SponsorBlock Activo</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* VIEW 4: PROXY SANDBOX & ELEMENT ZAPPER */}
            {/* ======================================================= */}
            {activeSubTab === 'proxy' && (
              <div className="flex-1 p-6 flex flex-col bg-gray-50 text-gray-800 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full space-y-5">
                  {/* Explanation Banner */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span>¿Cómo bloquea los anuncios tu Proxy Escolar?</span>
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed max-w-xl">
                        {isExtensionActive('adblocker-ultra') ? (
                          <span className="text-emerald-700 font-medium">
                            ✅ <strong>uBlock Ultra está ACTIVO:</strong> Tu proxy intercepta peticiones a Google Ads, Spotify Ad Logic y oculta todos los banners por CSS cosmético.
                          </span>
                        ) : (
                          <span className="text-rose-600 font-medium">
                            ⚠️ <strong>uBlock Ultra está DESACTIVADO:</strong> Los anuncios se cargarán dentro del proxy a menos que lo actives en los ajustes.
                          </span>
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => setProxyModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>Copiar Código para tu Proxy</span>
                    </button>
                  </div>

                  {/* Live Proxy Network Interception Console */}
                  <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 text-xs font-mono text-gray-200 shadow-md">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-800 text-gray-400">
                      <span className="flex items-center gap-2 text-[11px] font-bold text-gray-300">
                        <Terminal className="w-3.5 h-3.5 text-blue-400" />
                        <span>Consola del Proxy Ultraviolet / Bare Server (Tráfico en tiempo real)</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {isExtensionActive('adblocker-ultra') ? 'FILTROS: ACTIVOS' : 'FILTROS: INACTIVOS'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {isExtensionActive('adblocker-ultra') ? (
                        <>
                          <div className="text-emerald-400 flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">BLOCKED</span>
                            <span>https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub...</span>
                          </div>
                          <div className="text-emerald-400 flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">BLOCKED</span>
                            <span>https://spclient.wg.spotify.com/ad-logic/v1/commercial/audio-ad.mp3</span>
                          </div>
                          <div className="text-emerald-400 flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-bold text-[10px]">BLOCKED</span>
                            <span>https://static.doubleclick.net/instream/ad_status.js</span>
                          </div>
                          <div className="text-cyan-300 flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-bold text-[10px]">INJECTED</span>
                            <span>Reglas cosméticas uBlock aplicadas a Spotify & YouTube (12 selectores ocultos)</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-rose-400 flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold text-[10px]">PERMITIDO</span>
                            <span>https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub... [200 OK]</span>
                          </div>
                          <div className="text-rose-400 flex items-center gap-2">
                            <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 font-bold text-[10px]">PERMITIDO</span>
                            <span>https://spclient.wg.spotify.com/ad-logic/v1/commercial/audio-ad.mp3 [200 OK]</span>
                          </div>
                          <div className="text-amber-400 text-[10px] pt-1">
                            ⚠️ Anuncios cargándose libremente. Activa uBlock Ultra para cortarlos.
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sample Web Page with banner that can be zapped */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <span className="text-xs font-mono text-gray-500">Página Web en Proxy: {proxyUrl}</span>
                      <span className="text-xs text-emerald-600 font-semibold">Cifrado SSL / Bare</span>
                    </div>

                    <h1 className="text-lg font-bold text-gray-900">Portal de Recursos y Juegos Escolares</h1>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Cuando navegas a través de un proxy en tu Chromebook, todas las peticiones pasan primero por el Service Worker de tu web. Si el AdBlocker está activo en tus ajustes, cancela los anuncios antes de que lleguen a la pantalla.
                    </p>

                    {/* Demonstration of element zapper / ad banner */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                      <div className="text-xs text-amber-900">
                        <span className="font-bold block">Banner Publicitario de Prueba</span>
                        <div className="text-amber-700 text-[11px]">Haz clic en el botón para eliminarlo al instante con el Element Zapper</div>
                      </div>
                      <button
                        onClick={(e) => {
                          const target = e.currentTarget.parentElement;
                          if (target) target.style.display = 'none';
                          incrementAdsBlocked(1);
                        }}
                        className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded-lg text-xs font-semibold cursor-pointer shadow-2xs"
                      >
                        ⚡ Borrar Elemento (Zapper)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <ProxyIntegrationModal
          isOpen={proxyModalOpen}
          onClose={() => setProxyModalOpen(false)}
        />
      </div>
    </div>
  );
};
