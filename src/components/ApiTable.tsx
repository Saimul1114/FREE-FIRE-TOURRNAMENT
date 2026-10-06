import React from 'react';
import { PublicApi } from '../types';
import { getCategoryIcon } from '../utils/categoryIcons';
import { ExternalLink, Bookmark, Code, ShieldCheck, ShieldAlert, Play } from 'lucide-react';

interface ApiTableProps {
  apis: PublicApi[];
  savedIds: Set<string>;
  onToggleSave: (api: PublicApi) => void;
  onInspect: (api: PublicApi) => void;
  onTestSandbox: (api: PublicApi) => void;
}

export const ApiTable: React.FC<ApiTableProps> = ({
  apis,
  savedIds,
  onToggleSave,
  onInspect,
  onTestSandbox
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-750 bg-slate-850/60 shadow-inner">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-750">
          <tr>
            <th className="py-3 px-4">API Name</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Auth</th>
            <th className="py-3 px-4 text-center">HTTPS</th>
            <th className="py-3 px-4 text-center">CORS</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {apis.map((api) => {
            const isSaved = savedIds.has(api.id);
            const isNoAuth = api.auth.toLowerCase().includes('no') || api.auth === 'No Auth';

            return (
              <tr 
                key={api.id}
                onClick={() => onInspect(api)}
                className="hover:bg-slate-800/80 cursor-pointer transition"
              >
                <td className="py-3 px-4 font-medium text-white whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 hover:text-cyan-400 font-semibold">
                      {api.name}
                    </span>
                    <a
                      href={api.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-white"
                      title="Visit API"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>

                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                    {getCategoryIcon(api.category, "w-3.5 h-3.5 text-indigo-400")}
                    <span>{api.category}</span>
                  </div>
                </td>

                <td className="py-3 px-4 max-w-xs xl:max-w-md truncate text-xs text-slate-300" title={api.description}>
                  {api.description}
                </td>

                <td className="py-3 px-4 whitespace-nowrap text-xs">
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    isNoAuth 
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  }`}>
                    {api.auth}
                  </span>
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap text-xs">
                  {api.https ? (
                    <span className="inline-flex items-center text-emerald-400 font-medium gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-rose-400 font-medium gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> No
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-center whitespace-nowrap text-xs">
                  <span className={`px-2 py-0.5 rounded ${
                    api.cors === 'Yes' 
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'text-slate-400'
                  }`}>
                    {api.cors}
                  </span>
                </td>

                <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onTestSandbox(api)}
                      title="Test"
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-slate-700/60 transition"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onInspect(api)}
                      title="Inspect code"
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-slate-700/60 transition"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleSave(api)}
                      title={isSaved ? "Saved" : "Save"}
                      className={`p-1.5 rounded-lg transition ${
                        isSaved ? 'text-pink-400' : 'text-slate-400 hover:text-pink-400'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
