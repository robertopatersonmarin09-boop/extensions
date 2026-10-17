export type ExtensionCategory = 
  | 'all'
  | 'blockers'
  | 'audio_video'
  | 'games_cheats'
  | 'stealth'
  | 'productivity';

export interface Extension {
  id: string;
  name: string;
  shortName: string;
  version: string;
  description: string;
  icon: string; // Icon identifier for rendering
  iconGradient?: string;
  category: ExtensionCategory;
  enabled: boolean;
  installed: boolean;
  author: string;
  homepage?: string;
  rating: number;
  ratingCount: number;
  usersCount: string;
  permissions: string[];
  features: string[];
  settings: {
    volumeMultiplier?: number; // 100 to 600 (%)
    bassBoost?: boolean;
    darkReaderBrightness?: number; // 50 to 150 (%)
    darkReaderContrast?: number; // 50 to 150 (%)
    darkReaderSepia?: number; // 0 to 100 (%)
    adsBlockedTotal?: number;
    popupsBlockedTotal?: number;
    panicHotkey?: string;
    panicDisguise?: 'classroom' | 'drive' | 'docs' | 'wikipedia';
    gameSpeedMultiplier?: number; // 0.5, 1, 2, 5, 10
    autoClickerCps?: number; // 1 to 50
    autoClickerActive?: boolean;
    customJs?: string;
    customCss?: string;
    [key: string]: any;
  };
  isCustom?: boolean;
}

export type ActiveTab = 'extensions' | 'store' | 'hub' | 'creator';
export type HubView = 'games' | 'spotify' | 'youtube' | 'proxy';
