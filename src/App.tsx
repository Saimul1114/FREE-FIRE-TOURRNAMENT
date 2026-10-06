import React, { useState, useMemo, useEffect } from 'react';
import rawApis from './data/publicApis.json';
import summaryData from './data/summary.json';
import { PublicApi, FilterState, ViewTab, DisplayMode, SortOption } from './types';
import { Header } from './components/Header';
import { ApiCard } from './components/ApiCard';
import { ApiTable } from './components/ApiTable';
import { ApiModal } from './components/ApiModal';
import { ApiSandbox } from './components/ApiSandbox';
import { ProjectMashup } from './components/ProjectMashup';
import { ExportModal } from './components/ExportModal';
import { getCategoryIcon } from './utils/categoryIcons';
import { 
  Search, Filter, LayoutGrid, List, X, 
  RotateCcw, Download, Sparkles, ChevronLeft, ChevronRight, 
  ShieldCheck, Check, Layers, Zap, ArrowUpDown, Bookmark
} from 'lucide-react';

const allApis = rawApis as PublicApi[];
const ITEMS_PER_PAGE = 24;

export default function App() {
  // Navigation tab
  const [currentTab, setCurrentTab] = useState<ViewTab>('directory');
  
  // Bookmarked IDs
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('public_apis_saved_ids');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    auth: 'All',
    httpsOnly: false,
    cors: 'All',
    sortBy: 'name-asc',
    onlySaved: false
  });

  // Display mode
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Sandbox state
  const [inspectedApi, setInspectedApi] = useState<PublicApi | null>(null);
  const [sandboxTargetApi, setSandboxTargetApi] = useState<PublicApi | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [showCategoryDrawer, setShowCategoryDrawer] = useState<boolean>(false);

  // Save bookmarked IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('public_apis_saved_ids', JSON.stringify(Array.from(savedIds)));
    } catch {
      // ignore storage quota error
    }
  }, [savedIds]);

  const toggleSave = (api: PublicApi) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(api.id)) {
        next.delete(api.id);
      } else {
        next.add(api.id);
      }
      return next;
    });
  };

  const handleOpenSandbox = (api: PublicApi) => {
    setSandboxTargetApi(api);
    setCurrentTab('sandbox');
  };

  const handleRandomApi = () => {
    const random = allApis[Math.floor(Math.random() * allApis.length)];
    if (random) {
      setInspectedApi(random);
    }
  };

  // Switch to Saved tab
  const handleTabChange = (tab: ViewTab) => {
    setCurrentTab(tab);
    if (tab === 'saved') {
      setFilters(prev => ({ ...prev, onlySaved: true }));
    } else if (filters.onlySaved) {
      setFilters(prev => ({ ...prev, onlySaved: false }));
    }
  };

  // Filtered & Sorted APIs
  const filteredApis = useMemo(() => {
    let result = allApis;

    // Filter by tab == 'saved' or onlySaved
    if (currentTab === 'saved' || filters.onlySaved) {
      result = result.filter(api => savedIds.has(api.id));
    }

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(api => 
        api.name.toLowerCase().includes(q) ||
        api.description.toLowerCase().includes(q) ||
        api.category.toLowerCase().includes(q) ||
        api.auth.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(api => api.category === filters.category);
    }

    // Auth filter
    if (filters.auth !== 'All') {
      if (filters.auth === 'No Auth') {
        result = result.filter(api => api.auth.toLowerCase().includes('no') || api.auth === 'No Auth');
      } else {
        result = result.filter(api => api.auth.toLowerCase().includes(filters.auth.toLowerCase()));
      }
    }

    // HTTPS filter
    if (filters.httpsOnly) {
      result = result.filter(api => api.https);
    }

    // CORS filter
    if (filters.cors !== 'All') {
      result = result.filter(api => api.cors.toLowerCase() === filters.cors.toLowerCase());
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (filters.sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (filters.sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (filters.sortBy === 'category') return a.category.localeCompare(b.category);
      if (filters.sortBy === 'auth') return a.auth.localeCompare(b.auth);
      return 0;
    });

    return result;
  }, [allApis, filters, currentTab, savedIds]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, currentTab]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredApis.length / ITEMS_PER_PAGE));
  const paginatedApis = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApis.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredApis, currentPage]);

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      auth: 'All',
      httpsOnly: false,
      cors: 'All',
      sortBy: 'name-asc',
      onlySaved: false
    });
  };

  const activeFiltersCount = [
    filters.search !== '',
    filters.category !== 'All',
    filters.auth !== 'All',
    filters.httpsOnly,
    filters.cors !== 'All',
    filters.onlySaved
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        savedCount={savedIds.size}
        totalApis={allApis.length}
        onRandomApi={handleRandomApi}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: DIRECTORY or SAVED */}
        {(currentTab === 'directory' || currentTab === 'saved') && (
          <div className="space-y-6">
            
            {/* Hero / Stat banner if on Directory with no search */}
            {currentTab === 'directory' && !filters.search && filters.category === 'All' && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Curated from github.com/public-apis/public-apis</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Explore 2,000+ Free Public APIs
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                    Instantly search, test, and integrate free APIs for apps, tools, and side projects. Filter by authentication type, client-side CORS compatibility, and test endpoints live right in your browser.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 bg-slate-850/80 px-3 py-1.5 rounded-xl border border-slate-750">
                      <span className="font-bold text-white">{allApis.length.toLocaleString()}</span>
                      <span className="text-slate-400">Total APIs</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-850/80 px-3 py-1.5 rounded-xl border border-slate-750">
                      <span className="font-bold text-emerald-400">1,000+</span>
                      <span className="text-slate-400">Zero Auth Required</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-850/80 px-3 py-1.5 rounded-xl border border-slate-750">
                      <span className="font-bold text-cyan-400">51</span>
                      <span className="text-slate-400">Categories</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Tab Header */}
            {currentTab === 'saved' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                    <Bookmark className="w-5 h-5 fill-current" />
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Your Bookmarked APIs</h2>
                    <p className="text-xs text-slate-400">
                      {savedIds.size} {savedIds.size === 1 ? 'API' : 'APIs'} saved locally in your browser
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Controls & Search Bar */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* Row 1: Search & View toggles */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search APIs by name, keywords, category, or features..."
                    className="w-full bg-slate-850 border border-slate-750 text-slate-100 text-sm rounded-xl pl-10 pr-10 py-2.5 outline-none focus:border-indigo-500 placeholder-slate-500"
                  />
                  {filters.search && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as SortOption }))}
                      className="bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-xl pl-8 pr-7 py-2.5 outline-none focus:border-indigo-500 cursor-pointer appearance-none"
                    >
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="category">Category</option>
                      <option value="auth">Auth Type</option>
                    </select>
                  </div>

                  {/* Grid / Table Toggle */}
                  <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-750">
                    <button
                      onClick={() => setDisplayMode('grid')}
                      title="Grid View"
                      className={`p-1.5 rounded-lg transition ${
                        displayMode === 'grid'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDisplayMode('table')}
                      title="Table View"
                      className={`p-1.5 rounded-lg transition ${
                        displayMode === 'table'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={() => setIsExportOpen(true)}
                    title="Export APIs"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-850 hover:bg-slate-750 text-slate-300 border border-slate-750 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Export</span>
                  </button>
                </div>

              </div>

              {/* Row 2: Faceted Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                
                {/* Category Pill Dropdown */}
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="All">All Categories ({allApis.length})</option>
                    {summaryData.categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat} ({(summaryData.categoryCounts as any)[cat] || 0})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Auth Type selector */}
                <select
                  value={filters.auth}
                  onChange={(e) => setFilters(prev => ({ ...prev, auth: e.target.value }))}
                  className="bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All Auth Types</option>
                  <option value="No Auth">No Auth (Free)</option>
                  <option value="apiKey">API Key Required</option>
                  <option value="OAuth">OAuth</option>
                  <option value="User-Agent">User-Agent</option>
                  <option value="X-Mashape-Key">X-Mashape-Key</option>
                </select>

                {/* CORS filter */}
                <select
                  value={filters.cors}
                  onChange={(e) => setFilters(prev => ({ ...prev, cors: e.target.value }))}
                  className="bg-slate-850 border border-slate-750 text-slate-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="All">All CORS</option>
                  <option value="Yes">CORS: Yes (Browser)</option>
                  <option value="No">CORS: No</option>
                  <option value="Unknown">CORS: Unknown</option>
                </select>

                {/* HTTPS toggle */}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, httpsOnly: !prev.httpsOnly }))}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
                    filters.httpsOnly
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-850 border-slate-750 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>HTTPS Only</span>
                </button>

                {/* Reset button if any filter active */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset ({activeFiltersCount})</span>
                  </button>
                )}

                <div className="ml-auto text-xs text-slate-400">
                  Found <strong className="text-white">{filteredApis.length.toLocaleString()}</strong> APIs
                </div>

              </div>

            </div>

            {/* Results Grid / Table */}
            {filteredApis.length === 0 ? (
              <div className="text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                <Search className="w-10 h-10 mx-auto text-slate-600" />
                <h3 className="text-base font-bold text-white">No APIs match your current filters</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your keywords, expanding categories, or clearing authentication constraints.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            ) : displayMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedApis.map((api) => (
                  <ApiCard
                    key={api.id}
                    api={api}
                    isSaved={savedIds.has(api.id)}
                    onToggleSave={toggleSave}
                    onInspect={setInspectedApi}
                    onTestSandbox={handleOpenSandbox}
                  />
                ))}
              </div>
            ) : (
              <ApiTable
                apis={paginatedApis}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                onInspect={setInspectedApi}
                onTestSandbox={handleOpenSandbox}
              />
            )}

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2">
                <span className="text-xs text-slate-400">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredApis.length)} of {filteredApis.length.toLocaleString()} APIs
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-slate-850 hover:bg-slate-750 disabled:opacity-40 text-slate-200 border border-slate-750 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="text-xs font-medium text-slate-300 px-3">
                    Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-slate-850 hover:bg-slate-750 disabled:opacity-40 text-slate-200 border border-slate-750 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: LIVE TESTER SANDBOX */}
        {currentTab === 'sandbox' && (
          <ApiSandbox initialApi={sandboxTargetApi} />
        )}

        {/* TAB 3: PROJECT MASHUP */}
        {currentTab === 'mashup' && (
          <ProjectMashup apis={allApis} onInspect={setInspectedApi} />
        )}

      </main>

      {/* Detail Inspection Modal */}
      <ApiModal
        api={inspectedApi}
        isOpen={Boolean(inspectedApi)}
        onClose={() => setInspectedApi(null)}
        isSaved={inspectedApi ? savedIds.has(inspectedApi.id) : false}
        onToggleSave={toggleSave}
        onTestSandbox={handleOpenSandbox}
      />

      {/* Export Modal */}
      <ExportModal
        apis={filteredApis}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={filters.onlySaved || currentTab === 'saved' ? "Export Saved APIs" : "Export Filtered APIs"}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-900/60 py-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-300">Public APIs Explorer</span> — Open source developer API directory.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/public-apis/public-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition"
            >
              Curated from public-apis/public-apis
            </a>
            <span>•</span>
            <button
              onClick={handleRandomApi}
              className="hover:text-cyan-400 transition"
            >
              Random API
            </button>
            <span>•</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="hover:text-cyan-400 transition"
            >
              Export Catalog
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
