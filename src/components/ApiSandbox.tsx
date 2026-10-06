import React, { useState, useEffect } from 'react';
import { PRESET_ENDPOINTS } from '../data/presetEndpoints';
import { PresetEndpoint, PublicApi } from '../types';
import { 
  Play, Copy, Check, RotateCcw, AlertTriangle, 
  Clock, Zap, CheckCircle2, XCircle, Code, ChevronDown, 
  ExternalLink
} from 'lucide-react';

interface ApiSandboxProps {
  initialApi?: PublicApi | null;
}

export const ApiSandbox: React.FC<ApiSandboxProps> = ({ initialApi }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_ENDPOINTS[0].id);
  const [url, setUrl] = useState<string>(PRESET_ENDPOINTS[0].url);
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [headersInput, setHeadersInput] = useState<string>('{\n  "Accept": "application/json"\n}');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCorsError, setIsCorsError] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // Sync if initialApi passed
  useEffect(() => {
    if (initialApi) {
      setUrl(initialApi.link);
      setSelectedPresetId('custom');
      // If we know it's a specific API or format, pre-fill
      setResponseData(null);
      setResponseStatus(null);
      setErrorMessage(null);
      setIsCorsError(false);
    }
  }, [initialApi]);

  const handleSelectPreset = (preset: PresetEndpoint) => {
    setSelectedPresetId(preset.id);
    setUrl(preset.url);
    setMethod(preset.method);
    setResponseData(null);
    setResponseStatus(null);
    setErrorMessage(null);
    setIsCorsError(false);
  };

  const handleSendRequest = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setIsCorsError(false);
    setResponseData(null);
    setResponseStatus(null);

    let parsedHeaders = {};
    try {
      if (headersInput.trim()) {
        parsedHeaders = JSON.parse(headersInput);
      }
    } catch {
      setErrorMessage('Invalid JSON format in Request Headers.');
      setIsLoading(false);
      return;
    }

    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        method,
        headers: {
          ...parsedHeaders
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);
      setStatusText(res.statusText || (res.status === 200 ? 'OK' : 'Response Received'));

      // Extract headers
      const hdrs: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        hdrs[key] = val;
      });
      setResponseHeaders(hdrs);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        setResponseData(json);
        setRawResponse(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          setResponseData(parsed);
          setRawResponse(JSON.stringify(parsed, null, 2));
        } catch {
          setResponseData(text);
          setRawResponse(text);
        }
      }
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      
      const isTypeError = err.name === 'TypeError' || err.message?.includes('Failed to fetch');
      if (isTypeError) {
        setIsCorsError(true);
        setErrorMessage('Request blocked by Browser CORS or Network restriction. The external API server does not permit direct in-browser JavaScript requests.');
      } else {
        setErrorMessage(err.message || 'Network request failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (rawResponse) {
      navigator.clipboard.writeText(rawResponse);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-white">Live API Testing Sandbox</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Execute live HTTP requests directly against public APIs. Test endpoints, inspect latency and real-time JSON responses with zero setup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              ⚡ Instant Execution
            </span>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              🌐 In-Browser Client
            </span>
          </div>
        </div>

        {/* Quick presets picker */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Quick Test Working Endpoints:
            </span>
            <span className="text-[11px] text-slate-400">
              Verified CORS-enabled endpoints
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {PRESET_ENDPOINTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg transition font-medium ${
                  selectedPresetId === preset.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Request Builder Form */}
      <div className="bg-slate-850/80 rounded-2xl border border-slate-750 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          
          {/* Method */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
            className="bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-xs sm:text-sm rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>

          {/* URL Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setSelectedPresetId('custom');
              }}
              placeholder="https://api.example.com/v1/data"
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 placeholder-slate-500 font-mono"
            />
          </div>

          {/* Execute Button */}
          <button
            onClick={handleSendRequest}
            disabled={isLoading || !url.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-md shadow-indigo-600/20"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-emerald-400" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Headers input */}
        <details className="text-xs text-slate-300 group">
          <summary className="cursor-pointer font-medium text-slate-400 hover:text-slate-200 flex items-center gap-1">
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            <span>Customize Request Headers (JSON)</span>
          </summary>
          <div className="mt-2">
            <textarea
              rows={3}
              value={headersInput}
              onChange={(e) => setHeadersInput(e.target.value)}
              className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-800 outline-none focus:border-indigo-500"
              placeholder='{ "Accept": "application/json" }'
            />
          </div>
        </details>
      </div>

      {/* Response Panel */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Status header */}
        <div className="p-4 bg-slate-850/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Response
            </span>
            
            {responseStatus !== null && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                responseStatus >= 200 && responseStatus < 300
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {responseStatus >= 200 && responseStatus < 300 ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>{responseStatus} {statusText}</span>
              </span>
            )}

            {responseTime !== null && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>{responseTime} ms</span>
              </span>
            )}
          </div>

          {rawResponse && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copiedResponse ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Content Box */}
        <div className="p-4">
          
          {/* CORS Error Notice */}
          {isCorsError && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm space-y-2 mb-4">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Browser CORS Security Restriction Triggered</span>
              </div>
              <p className="leading-relaxed">
                Modern browsers restrict frontend JavaScript from querying external APIs that have not enabled CORS headers (<code className="bg-amber-900/50 px-1 py-0.5 rounded">Access-Control-Allow-Origin: *</code>).
              </p>
              <div className="bg-slate-900/80 p-3 rounded-lg border border-amber-800/50 space-y-1 font-mono text-xs text-slate-300">
                <p className="text-cyan-300">💡 How to use this API in real projects:</p>
                <p>1. Call it from your backend server (e.g. Node.js Express, Python, Go) — server-to-server requests bypass CORS completely!</p>
                <p>2. Or test one of the verified CORS-friendly presets above (like Cat Facts, PokeAPI, Open-Meteo, JokeAPI).</p>
              </div>
            </div>
          )}

          {errorMessage && !isCorsError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm mb-4">
              <div className="flex items-center gap-2 font-semibold text-rose-300 mb-1">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Request Error</span>
              </div>
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Result view */}
          {responseData !== null ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-[500px]">
              <pre className="font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed">
                {rawResponse}
              </pre>
            </div>
          ) : !isLoading && !errorMessage ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Code className="w-10 h-10 mx-auto text-slate-600 stroke-[1.5]" />
              <p className="text-sm">Click "Send Request" to test this endpoint live.</p>
              <p className="text-xs text-slate-600">Select any preset endpoint above for instant results.</p>
            </div>
          ) : null}

        </div>

      </div>

    </div>
  );
};
