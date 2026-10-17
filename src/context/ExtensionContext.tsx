import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Extension, ActiveTab } from '../types/extension';
import { DEFAULT_EXTENSIONS } from '../data/defaultExtensions';

interface ExtensionContextType {
  extensions: Extension[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  devMode: boolean;
  setDevMode: (val: boolean) => void;
  inspectingExtension: Extension | null;
  setInspectingExtension: (ext: Extension | null) => void;
  toggleExtension: (id: string, forceState?: boolean) => void;
  installExtension: (id: string) => void;
  uninstallExtension: (id: string) => void;
  updateExtensionSettings: (id: string, settings: Partial<Extension['settings']>) => void;
  addCustomExtension: (newExt: Partial<Extension>) => void;
  deleteCustomExtension: (id: string) => void;
  isExtensionActive: (id: string) => boolean;
  
  // Real-time extension state bridges:
  volumeMultiplier: number;
  setVolumeMultiplier: (val: number) => void;
  bassBoost: boolean;
  setBassBoost: (val: boolean) => void;
  
  adsBlockedCount: number;
  incrementAdsBlocked: (count?: number) => void;
  
  panicModeActive: boolean;
  setPanicModeActive: (val: boolean) => void;
  triggerPanic: () => void;
  panicDisguise: 'classroom' | 'drive' | 'docs' | 'wikipedia';
  setPanicDisguise: (val: 'classroom' | 'drive' | 'docs' | 'wikipedia') => void;
  
  screenityDrawingActive: boolean;
  setScreenityDrawingActive: (val: boolean) => void;
  
  gameSpeed: number;
  setGameSpeed: (val: number) => void;
  
  darkReaderActive: boolean;
  darkReaderSettings: { brightness: number; contrast: number; sepia: number };
  setDarkReaderSettings: (val: { brightness: number; contrast: number; sepia: number }) => void;
}

const STORAGE_KEY = 'chromebook_extensions_v2';
const DEV_MODE_KEY = 'chromebook_ext_dev_mode';

const ExtensionContext = createContext<ExtensionContextType | undefined>(undefined);

export const ExtensionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [extensions, setExtensions] = useState<Extension[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure default extensions are present
        const defaultIds = new Set(DEFAULT_EXTENSIONS.map(d => d.id));
        const merged = [...parsed];
        for (const def of DEFAULT_EXTENSIONS) {
          if (!merged.some(e => e.id === def.id)) {
            merged.push(def);
          }
        }
        return merged;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_EXTENSIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('extensions');
  const [devMode, setDevModeState] = useState<boolean>(() => {
    return localStorage.getItem(DEV_MODE_KEY) === 'true';
  });
  const [inspectingExtension, setInspectingExtension] = useState<Extension | null>(null);

  // States controlled by specific extensions
  const [volumeMultiplier, setVolumeMultiplierState] = useState<number>(250);
  const [bassBoost, setBassBoostState] = useState<boolean>(true);
  const [adsBlockedCount, setAdsBlockedCount] = useState<number>(247);
  const [panicModeActive, setPanicModeActive] = useState<boolean>(false);
  const [panicDisguise, setPanicDisguiseState] = useState<'classroom' | 'drive' | 'docs' | 'wikipedia'>('classroom');
  const [screenityDrawingActive, setScreenityDrawingActive] = useState<boolean>(false);
  const [gameSpeed, setGameSpeedState] = useState<number>(1.0);
  const [darkReaderSettings, setDarkReaderSettings] = useState({
    brightness: 100,
    contrast: 105,
    sepia: 15
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(extensions));
    } catch {
      // ignore
    }
  }, [extensions]);

  const setDevMode = (val: boolean) => {
    setDevModeState(val);
    localStorage.setItem(DEV_MODE_KEY, String(val));
  };

  const isExtensionActive = (id: string): boolean => {
    const ext = extensions.find(e => e.id === id);
    return Boolean(ext && ext.installed && ext.enabled);
  };

  const toggleExtension = (id: string, forceState?: boolean) => {
    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === id) {
          const nextState = forceState !== undefined ? forceState : !ext.enabled;
          // Trigger instant visual or functional feedback
          if (ext.id === 'volume-master' && !nextState) {
            setVolumeMultiplierState(100);
          } else if (ext.id === 'volume-master' && nextState) {
            setVolumeMultiplierState(ext.settings.volumeMultiplier || 250);
          }
          if (ext.id === 'game-speed-hack' && !nextState) {
            setGameSpeedState(1.0);
          }
          if (ext.id === 'screenity' && !nextState) {
            setScreenityDrawingActive(false);
          }
          return { ...ext, enabled: nextState };
        }
        return ext;
      })
    );
  };

  const installExtension = (id: string) => {
    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === id) {
          return { ...ext, installed: true, enabled: true };
        }
        return ext;
      })
    );
  };

  const uninstallExtension = (id: string) => {
    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === id) {
          return { ...ext, installed: false, enabled: false };
        }
        return ext;
      })
    );
    if (inspectingExtension?.id === id) {
      setInspectingExtension(null);
    }
  };

  const updateExtensionSettings = (id: string, newSettings: Partial<Extension['settings']>) => {
    setExtensions(prev =>
      prev.map(ext => {
        if (ext.id === id) {
          const updated = {
            ...ext,
            settings: { ...ext.settings, ...newSettings }
          };
          if (inspectingExtension?.id === id) {
            setInspectingExtension(updated);
          }
          return updated;
        }
        return ext;
      })
    );
  };

  const addCustomExtension = (newExt: Partial<Extension>) => {
    const id = 'custom-' + Date.now();
    const created: Extension = {
      id,
      name: newExt.name || 'Mi Extensión Personalizada',
      shortName: newExt.shortName || newExt.name?.slice(0, 15) || 'Custom Script',
      version: newExt.version || '1.0.0',
      description: newExt.description || 'Extensión personalizada inyectada para juegos y proxies de clase.',
      icon: newExt.icon || 'code-2',
      iconGradient: 'from-blue-600 to-indigo-800',
      category: newExt.category || 'productivity',
      enabled: true,
      installed: true,
      author: newExt.author || 'Tú (Estudiante Chromebook)',
      rating: 5.0,
      ratingCount: 1,
      usersCount: '1',
      permissions: ['Inyección en tiempo de ejecución', 'Manipulación de scripts y DOM'],
      features: ['Script personalizado de usuario', 'CSS personalizado'],
      settings: {
        customJs: newExt.settings?.customJs || '// Código JavaScript personalizado\nconsole.log("Extensión activa");',
        customCss: newExt.settings?.customCss || '/* Estilos personalizados */'
      },
      isCustom: true
    };

    setExtensions(prev => [created, ...prev]);
  };

  const deleteCustomExtension = (id: string) => {
    setExtensions(prev => prev.filter(e => e.id !== id));
    if (inspectingExtension?.id === id) {
      setInspectingExtension(null);
    }
  };

  const incrementAdsBlocked = (count: number = 1) => {
    setAdsBlockedCount(prev => prev + count);
    updateExtensionSettings('adblocker-ultra', {
      adsBlockedTotal: (extensions.find(e => e.id === 'adblocker-ultra')?.settings.adsBlockedTotal || 0) + count
    });
  };

  const triggerPanic = () => {
    setPanicModeActive(prev => !prev);
  };

  // Keyboard shortcut listener for Panic Key (Escape or ~)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Escape and Tab Cloak is active
      const tabCloak = extensions.find(e => e.id === 'tab-cloak');
      if (tabCloak && tabCloak.installed && tabCloak.enabled) {
        if (e.key === 'Escape' || e.key === '`') {
          // If we are on panic screen, Escape can exit too if pressed again, or click to exit
          setPanicModeActive(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [extensions]);

  // Document title and favicon cloaking when tab-cloak is enabled
  useEffect(() => {
    const isTabCloakOn = isExtensionActive('tab-cloak');
    const titleEl = document.querySelector('title');
    const faviconEl = document.querySelector('link[rel*="icon"]') as HTMLLinkElement | null;

    if (panicModeActive) {
      if (titleEl) titleEl.textContent = 'Clases - Google Classroom';
      if (faviconEl) {
        faviconEl.href = 'https://ssl.gstatic.com/classroom/favicon.png';
      }
    } else if (isTabCloakOn) {
      if (titleEl) titleEl.textContent = 'Google Classroom';
    } else {
      if (titleEl) titleEl.textContent = 'Extensiones - Chrome OS Hub';
    }
  }, [panicModeActive, extensions]);

  const darkReaderActive = isExtensionActive('dark-reader');

  const setVolumeMultiplier = (val: number) => {
    setVolumeMultiplierState(val);
    updateExtensionSettings('volume-master', { volumeMultiplier: val });
  };

  const setBassBoost = (val: boolean) => {
    setBassBoostState(val);
    updateExtensionSettings('volume-master', { bassBoost: val });
  };

  const setGameSpeed = (val: number) => {
    setGameSpeedState(val);
    updateExtensionSettings('game-speed-hack', { gameSpeedMultiplier: val });
  };

  const setPanicDisguise = (val: 'classroom' | 'drive' | 'docs' | 'wikipedia') => {
    setPanicDisguiseState(val);
    updateExtensionSettings('tab-cloak', { panicDisguise: val });
  };

  return (
    <ExtensionContext.Provider
      value={{
        extensions,
        activeTab,
        setActiveTab,
        devMode,
        setDevMode,
        inspectingExtension,
        setInspectingExtension,
        toggleExtension,
        installExtension,
        uninstallExtension,
        updateExtensionSettings,
        addCustomExtension,
        deleteCustomExtension,
        isExtensionActive,
        volumeMultiplier,
        setVolumeMultiplier,
        bassBoost,
        setBassBoost,
        adsBlockedCount,
        incrementAdsBlocked,
        panicModeActive,
        setPanicModeActive,
        triggerPanic,
        panicDisguise,
        setPanicDisguise,
        screenityDrawingActive,
        setScreenityDrawingActive,
        gameSpeed,
        setGameSpeed,
        darkReaderActive,
        darkReaderSettings,
        setDarkReaderSettings
      }}
    >
      {children}
    </ExtensionContext.Provider>
  );
};

export const useExtensions = () => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error('useExtensions must be used within an ExtensionProvider');
  }
  return context;
};
