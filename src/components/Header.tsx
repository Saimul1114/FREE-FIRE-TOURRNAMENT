import React from 'react';
import { ViewTab } from '../types';
import { 
  Database, Play, Lightbulb, Bookmark, Github, Sparkles, 
  ExternalLink, Layers
} from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  savedCount: number;
  totalApis: number;
  onRandomApi: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  savedCount,
  totalApis,
  onRandomApi,
  onOpenExport
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">Public APIs</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Curated directory of {totalApis.toLocaleString()} free developer APIs
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onTabChange('directory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'directory'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span className="hidden md:inline">Directory</span>
            </button>

            <button
              onClick={() => onTabChange('sandbox')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'sandbox'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Tester</span>
            </button>

            <button
              onClick={() => onTabChange('mashup')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'mashup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Idea Mashup</span>
            </button>

            <button
              onClick={() => onTabChange('saved')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'saved'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-4 h-4 text-pink-400" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Actions & Github */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRandomApi}
              title="Surprise me with a random API"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Random API</span>
            </button>

            <a
              href="https://github.com/public-apis/public-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="View public-apis on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden lg:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
