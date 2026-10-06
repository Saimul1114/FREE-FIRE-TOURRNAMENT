import React, { useState } from 'react';
import { PublicApi } from '../types';
import { getCategoryIcon } from '../utils/categoryIcons';
import { 
  X, ExternalLink, Bookmark, Copy, Check, Play, 
  Terminal, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { 
  generateCurlSnippet, 
  generateFetchSnippet, 
  generatePythonSnippet, 
  generateAxiosSnippet 
} from '../utils/codeGenerators';

interface ApiModalProps {
  api: PublicApi | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (api: PublicApi) => void;
  onTestSandbox: (api: PublicApi) => void;
}

type CodeTab = 'fetch' | 'curl' | 'python' | 'axios';

export const ApiModal: React.FC<ApiModalProps> = ({
  api,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onTestSandbox
}) => {
  const [activeTab, setActiveTab] = useState<CodeTab>('fetch');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !api) return null;

  const getCode = () => {
    switch (activeTab) {
      case 'fetch':
        return generateFetchSnippet(api);
      case 'curl':
        return generateCurlSnippet(api);
      case 'python':
        return generatePythonSnippet(api);
      case 'axios':
        return generateAxiosSnippet(api);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-850/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 mt-0.5">
              {getCategoryIcon(api.category, "w-6 h-6")}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                  {api.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  api.auth === 'No Auth' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {api.auth}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
                {api.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
              About this API
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-850 p-3.5 rounded-xl border border-slate-800">
              {api.description || 'No description provided.'}
            </p>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Authentication</span>
              <span className="font-semibold text-slate-100">{api.auth}</span>
            </div>
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">HTTPS Support</span>
              <span className="font-semibold text-slate-100 flex items-center gap-1">
                {api.https ? (
                  <><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Yes</>
                ) : (
                  <><ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> No</>
                )}
              </span>
            </div>
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Browser CORS</span>
              <span className="font-semibold text-slate-100">{api.cors}</span>
            </div>
            <div className="p-3 bg-slate-850 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Category</span>
              <span className="font-semibold text-slate-100 truncate">{api.category}</span>
            </div>
          </div>

          {/* Code Snippets Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Ready-to-use Code Snippet
                </h4>
              </div>
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                {(['fetch', 'curl', 'python', 'axios'] as CodeTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'fetch' ? 'Fetch' : tab === 'curl' ? 'cURL' : tab === 'python' ? 'Python' : 'Axios'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-cyan-300 overflow-x-auto shadow-inner">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
              <pre className="pr-16">{getCode()}</pre>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-850/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(api)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                isSaved
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-pink-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved to Bookmarks' : 'Bookmark API'}</span>
            </button>

            <a
              href={api.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Visit Official Docs</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onTestSandbox(api);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
            >
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Open in Live Sandbox</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
