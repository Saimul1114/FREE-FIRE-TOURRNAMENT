import React, { useState } from 'react';
import { PublicApi } from '../types';
import { 
  Lightbulb, Sparkles, Shuffle, ArrowRight, 
  ExternalLink, Code, Star, Check, Copy
} from 'lucide-react';
import { getCategoryIcon } from '../utils/categoryIcons';

interface ProjectMashupProps {
  apis: PublicApi[];
  onInspect: (api: PublicApi) => void;
}

interface IdeaTemplate {
  title: string;
  category1: string;
  category2: string;
  description: string;
  techStack: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

const PRESET_IDEAS: IdeaTemplate[] = [
  {
    title: 'Weather-Synced Playlist Generator',
    category1: 'Weather',
    category2: 'Music',
    description: 'Fetch real-time atmospheric conditions (rain, sunshine, snow, storm) and query music APIs to generate mood-matching dynamic Spotify/Soundcloud listening sessions.',
    techStack: ['Open-Meteo', 'Spotify Web API', 'React', 'Tailwind'],
    complexity: 'Beginner'
  },
  {
    title: 'Crypto Volatility Meme & Comic Bot',
    category1: 'Cryptocurrency',
    category2: 'Games & Comics',
    description: 'Monitor real-time Bitcoin/Ethereum price drops and pumps, and automatically generate humorous matching superhero or comic panels based on bull/bear market sentiments.',
    techStack: ['CoinGecko API', 'Marvel / XKCD API', 'Node.js', 'Canvas'],
    complexity: 'Intermediate'
  },
  {
    title: 'Pet Health & Walking Route Forecaster',
    category1: 'Animals',
    category2: 'Geocoding',
    description: 'Calculate ideal daily walking hours and safe pet routes by combining dog breed heat-tolerance limits with localized GPS weather and park data.',
    techStack: ['The Dog API', 'OpenStreetMap / Geocoding', 'Leaflet', 'TypeScript'],
    complexity: 'Intermediate'
  },
  {
    title: 'Global Recipe Cost & Currency Calculator',
    category1: 'Food & Drink',
    category2: 'Currency Exchange',
    description: 'Browse culinary dishes from world cultures, calculate ingredient cost estimates, and convert them dynamically into 160+ fiat and crypto currencies.',
    techStack: ['TheMealDB', 'Exchange Rates API', 'Next.js', 'Chart.js'],
    complexity: 'Beginner'
  },
  {
    title: 'AI Trivia Combat Arena',
    category1: 'Entertainment',
    category2: 'Machine Learning',
    description: 'A real-time multiplayer trivia game where questions are pulled from public quiz databases and an AI evaluator judges nuanced open-ended answers with scores.',
    techStack: ['Open Trivia DB', 'Gemini / HuggingFace', 'WebSockets', 'React'],
    complexity: 'Advanced'
  },
  {
    title: 'Public Transit Carbon Offset Compass',
    category1: 'Transportation',
    category2: 'Environment',
    description: 'Compute carbon emissions saved by taking public transit trains and buses versus driving, visualizing personal environmental savings over time.',
    techStack: ['Transit API', 'Carbon Interface', 'Vite', 'Recharts'],
    complexity: 'Intermediate'
  }
];

export const ProjectMashup: React.FC<ProjectMashupProps> = ({ apis, onInspect }) => {
  const [apiA, setApiA] = useState<PublicApi | null>(() => {
    return apis.find(a => a.category === 'Weather') || apis[0] || null;
  });
  const [apiB, setApiB] = useState<PublicApi | null>(() => {
    return apis.find(a => a.category === 'Music') || apis[1] || null;
  });
  const [copied, setCopied] = useState<boolean>(false);

  const rollRandomMashup = () => {
    if (apis.length < 2) return;
    const randomA = apis[Math.floor(Math.random() * apis.length)];
    let randomB = apis[Math.floor(Math.random() * apis.length)];
    // Ensure distinct categories if possible
    let attempts = 0;
    while (randomB.category === randomA.category && attempts < 10) {
      randomB = apis[Math.floor(Math.random() * apis.length)];
      attempts++;
    }
    setApiA(randomA);
    setApiB(randomB);
  };

  const generateProjectConcept = () => {
    if (!apiA || !apiB) return '';
    return `Create a web application that integrates "${apiA.name}" (${apiA.category}) with "${apiB.name}" (${apiB.category}). Users can leverage ${apiA.description} combined with ${apiB.description} to build a full-stack automated workflow or interactive dashboard.`;
  };

  const handleCopyConcept = () => {
    const text = generateProjectConcept();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hackathon & Portfolio Inspiration</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            API Mashup & Project Idea Generator
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            The most impressive developer projects combine two completely disparate data sources. Mash together two APIs below or roll random combinations to ignite your next hackathon project!
          </p>
        </div>
      </div>

      {/* Interactive Mashup Arena */}
      <div className="bg-slate-850/80 rounded-2xl border border-slate-750 p-6 shadow-md">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Dual-API Fusion</span>
          </h3>

          <button
            onClick={rollRandomMashup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
          >
            <Shuffle className="w-4 h-4" />
            <span>Roll Random Mashup</span>
          </button>
        </div>

        {/* The Two APIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch relative">
          
          {/* API A */}
          {apiA && (
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Source API 1
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {getCategoryIcon(apiA.category, "w-3.5 h-3.5 text-indigo-400")}
                    <span>{apiA.category}</span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white">{apiA.name}</h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {apiA.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Auth: <strong className="text-slate-200">{apiA.auth}</strong></span>
                <button
                  onClick={() => onInspect(apiA)}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          )}

          {/* API B */}
          {apiB && (
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Source API 2
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    {getCategoryIcon(apiB.category, "w-3.5 h-3.5 text-cyan-400")}
                    <span>{apiB.category}</span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white">{apiB.name}</h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {apiB.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Auth: <strong className="text-slate-200">{apiB.auth}</strong></span>
                <button
                  onClick={() => onInspect(apiB)}
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Synthesized Concept Card */}
        {apiA && apiB && (
          <div className="mt-6 p-5 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Synthesized Project Concept:
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Build an interactive web app that marries <strong className="text-indigo-300">{apiA.name}</strong> with <strong className="text-cyan-300">{apiB.name}</strong>:
                  {' '}Provide developers or end-users with live data pipelines connecting {apiA.category.toLowerCase()} and {apiB.category.toLowerCase()} workflows.
                </p>
              </div>

              <button
                onClick={handleCopyConcept}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Concept'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Curated Best Mashup Examples */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="font-bold text-white text-base">
            Curated Hackathon Showcase Concepts
          </h3>
          <span className="text-xs text-slate-400">
            Real architectural blueprints
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_IDEAS.map((idea, idx) => (
            <div
              key={idx}
              className="bg-slate-850/80 hover:bg-slate-800 rounded-xl p-5 border border-slate-750 flex flex-col justify-between transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-indigo-400">{idea.category1}</span>
                    <span>+</span>
                    <span className="text-cyan-400">{idea.category2}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    idea.complexity === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : idea.complexity === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {idea.complexity}
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm mb-2">
                  {idea.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-750/70 flex flex-wrap gap-1">
                {idea.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
