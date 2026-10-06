import React, { useState } from 'react';
import { PublicApi } from '../types';
import { X, Download, Copy, Check, FileCode, FileText } from 'lucide-react';

interface ExportModalProps {
  apis: PublicApi[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  apis,
  isOpen,
  onClose,
  title = "Export APIs"
}) => {
  const [format, setFormat] = useState<'json' | 'csv' | 'markdown'>('json');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const getExportData = () => {
    if (format === 'json') {
      return JSON.stringify(apis, null, 2);
    }
    if (format === 'csv') {
      const headers = ['Name', 'Category', 'Description', 'Auth', 'HTTPS', 'CORS', 'Link'];
      const rows = apis.map(a => [
        `"${a.name.replace(/"/g, '""')}"`,
        `"${a.category.replace(/"/g, '""')}"`,
        `"${a.description.replace(/"/g, '""')}"`,
        `"${a.auth.replace(/"/g, '""')}"`,
        a.https ? 'Yes' : 'No',
        `"${a.cors}"`,
        `"${a.link}"`
      ]);
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
    if (format === 'markdown') {
      const header = '| API | Category | Description | Auth | HTTPS | CORS |\n|---|---|---|---|---|---|';
      const rows = apis.map(a => 
        `| [${a.name}](${a.link}) | ${a.category} | ${a.description} | ${a.auth} | ${a.https ? 'Yes' : 'No'} | ${a.cors} |`
      );
      return [header, ...rows].join('\n');
    }
    return '';
  };

  const handleDownload = () => {
    const data = getExportData();
    const extension = format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'md';
    const mime = format === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `public-apis-export.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportData());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">{title} ({apis.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Export the currently active list of {apis.length.toLocaleString()} APIs into your desired data format.
        </p>

        {/* Format Selector */}
        <div className="flex items-center gap-2 mb-4 bg-slate-850 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFormat('json')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              format === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            JSON Format
          </button>
          <button
            onClick={() => setFormat('csv')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              format === 'csv' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CSV Spreadsheet
          </button>
          <button
            onClick={() => setFormat('markdown')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              format === 'markdown' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Markdown Table
          </button>
        </div>

        {/* Preview box */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-48 overflow-y-auto mb-5 font-mono text-xs text-slate-400">
          <pre>{getExportData().slice(0, 1500)}...</pre>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy to Clipboard'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Download File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
