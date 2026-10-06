import React, { useState } from 'react';
import { PublicApi } from '../types';
import { getCategoryIcon } from '../utils/categoryIcons';
import { 
  ExternalLink, Bookmark, Code, ShieldCheck, 
  ShieldAlert, Check, Play, Copy
} from 'lucide-react';
import { generateCurlSnippet } from '../utils/codeGenerators';

interface ApiCardProps {
  api: PublicApi;
  isSaved: boolean;
  onToggleSave: (api: PublicApi) => void;
  onInspect: (api: PublicApi) => void;
  onTestSandbox: (api: PublicApi) => void;
}

export const ApiCard: React.FC<ApiCardProps> = ({
  api,
  isSaved,
  onToggleSave,
  onInspect,
  onTestSandbox
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCurl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(generateCurlSnippet(api));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isNoAuth = api.auth.toLowerCase().includes('no') || api.auth === 'No Auth';

  return (
    <div className="group relative flex flex-col justify-between bg-slate-850/80 hover:bg-slate-800/90 rounded-xl p-5 border border-slate-700/60 hover:border-indigo-500/50 transition-all duration-200 shadow-sm hover:shadow-indigo-500/10 hover:-translate-y-0.5">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 border border-slate-700/80 group-hover:bg-indigo-950/40 group-hover:border-indigo-500/40 transition">
              {getCategoryIcon(api.category, "w-4 h-4")}
            </span>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-300 transition">
              {api.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyCurl}
              title={copied ? "Copied cURL command!" : "Copy cURL"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-750 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(api);
              }}
              title={isSaved ? "Remove from bookmarks" : "Save to bookmarks"}
              className={`p-1.5 rounded-lg transition ${
                isSaved 
                  ? 'text-pink-400 hover:text-pink-300 bg-pink-500/10' 
                  : 'text-slate-400 hover:text-pink-400 hover:bg-slate-750'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* API Title & Link */}
        <h3 className="font-semibold text-base text-slate-100 group-hover:text-cyan-300 transition flex items-center gap-2">
          <span>{api.name}</span>
          <a
            href={api.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open official API website / documentation"
            className="text-slate-500 hover:text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed min-h-[3rem]">
          {api.description || 'No detailed description provided.'}
        </p>
      </div>

      {/* Badges and Footer */}
      <div className="mt-4 pt-3 border-t border-slate-750/70">
        
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {/* Auth */}
          <span 
            className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md ${
              isNoAuth 
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isNoAuth ? 'Free (No Auth)' : `Auth: ${api.auth}`}
          </span>

          {/* HTTPS */}
          <span 
            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${
              api.https
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {api.https ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                HTTPS
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-rose-400" />
                HTTP
              </>
            )}
          </span>

          {/* CORS */}
          <span 
            className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md ${
              api.cors === 'Yes'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : api.cors === 'No'
                ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
            }`}
            title={api.cors === 'Yes' ? 'Supports browser client requests' : 'Requires backend proxy or server calls'}
          >
            CORS: {api.cors}
          </span>
        </div>

        {/* Buttons row */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onInspect(api)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Code & Details</span>
          </button>

          <button
            onClick={() => onTestSandbox(api)}
            title="Test this API or open sandbox"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test</span>
          </button>
        </div>

      </div>

    </div>
  );
};
