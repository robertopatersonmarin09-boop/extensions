import React from 'react';
import { 
  ShieldAlert, 
  Moon, 
  Ghost, 
  Zap, 
  MousePointerClick, 
  Code2, 
  Tv, 
  Puzzle,
  Sparkles
} from 'lucide-react';

interface Props {
  iconName: string;
  className?: string;
  size?: number;
}

export const ExtensionIcon: React.FC<Props> = ({ iconName, className = 'w-10 h-10', size = 40 }) => {
  // Screenity custom icon: realistic blue spherical gradient like Chrome Web Store / user screenshot
  if (iconName === 'screenity') {
    return (
      <div 
        className={`relative flex items-center justify-center rounded-full overflow-hidden shadow-sm shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-700 shadow-inner flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full bg-radial from-white/40 via-transparent to-transparent opacity-75 -translate-x-1 -translate-y-1" />
        </div>
      </div>
    );
  }

  // Volume Master custom icon: blue sound wave signals matching user screenshot
  if (iconName === 'volume-master') {
    return (
      <div 
        className={`relative flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-blue-600"
        >
          {/* Inner wave */}
          <path 
            d="M16 16C18.5 18.5 20 21.5 20 24C20 26.5 18.5 29.5 16 32" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          {/* Middle wave */}
          <path 
            d="M24 11C27.5 14.5 30 19 30 24C30 29 27.5 33.5 24 37" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
          {/* Outer wave */}
          <path 
            d="M32 6C37 11 40 17 40 24C40 31 37 37 32 42" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
    );
  }

  // Generic icons styled nicely
  switch (iconName) {
    case 'shield-alert':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <ShieldAlert className="w-3/5 h-3/5" />
        </div>
      );
    case 'moon':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center text-amber-300 shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <Moon className="w-3/5 h-3/5" />
        </div>
      );
    case 'ghost':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <Ghost className="w-3/5 h-3/5" />
        </div>
      );
    case 'zap':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <Zap className="w-3/5 h-3/5" />
        </div>
      );
    case 'mouse-pointer-click':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <MousePointerClick className="w-3/5 h-3/5" />
        </div>
      );
    case 'code-2':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-slate-700 to-gray-900 flex items-center justify-center text-emerald-400 shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <Code2 className="w-3/5 h-3/5" />
        </div>
      );
    case 'picture-in-picture':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <Tv className="w-3/5 h-3/5" />
        </div>
      );
    default:
      return (
        <div className={`rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0 ${className}`} style={{ width: size, height: size }}>
          <Puzzle className="w-3/5 h-3/5" />
        </div>
      );
  }
};
