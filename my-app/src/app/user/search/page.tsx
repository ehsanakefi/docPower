"use client";
import { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { UserDashboardLayout } from '../../components/UserDashboardLayout';
import { SearchResultCard } from '../../usercomponents/SearchResultCard';
import { FilterSidebar } from '../../usercomponents/FilterSidebar';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Loader2, Search } from 'lucide-react';

type SearchMode = 'simple' | 'ir' | 'rag';

interface SearchResult {
  chunkId: string;
  documentId: string;
  fileName: string;
  text: string;
  snippet?: string;
  score: number;
}

export default function UserSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('simple');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    documentCode: '',
    approvalDate: '',
    issuingBodies: [] as string[],
    technicalDomains: [] as string[],
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('لطفا عبارت جستجو را وارد کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(
        `${apiUrl}/api/search?q=${encodeURIComponent(searchQuery)}&mode=${searchMode}`
      );

      if (!response.ok) {
        throw new Error(`خطا در جستجو: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
      } else {
        setError(data.message || 'خطای ناشناخته در جستجو');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ارتباط با سرور');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModeLabel = (mode: SearchMode): string => {
    switch (mode) {
      case 'simple': return 'جستجوی ساده';
      case 'ir': return 'جستجوی کلاسیک (IR)';
      case 'rag': return 'جستجوی هوشمند (RAG)';
    }
  };

  const getModeDescription = (mode: SearchMode): string => {
    switch (mode) {
      case 'simple': return 'جستجوی دقیق متنی در پاراگراف‌ها';
      case 'ir': return 'جستجوی اطلاعاتی پیشرفته با BM25/TF-IDF';
      case 'rag': return 'جستجوی برداری با هوش مصنوعی';
    }
  };

  return (
    <ProtectedRoute requiredRole= {['VIEWER', 'EDITOR']}>
      <UserDashboardLayout>
        <div className="p-6">
          {/* Search Header */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            جستجو در اسناد
          </h1>

          {/* Search Bar and Mode Selector */}
          <div className="mb-6 bg-white dark:bg-slate-900 p-6 rounded-lg shadow">
            <div className="flex gap-4 mb-4">
              <Input
                type="text"
                placeholder="عبارت جستجو را وارد کنید..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 text-right"
              />
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Search className="w-4 h-4 ml-2" />}
                جستجو
              </Button>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2">
              {(['simple', 'ir', 'rag'] as SearchMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSearchMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    searchMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  title={getModeDescription(mode)}
                >
                  {getModeLabel(mode)}
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-right">
              {getModeDescription(searchMode)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {error && (
                <div className="text-center py-6 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  {error}
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                  <p className="text-slate-500 mt-2">در حال جستجو...</p>
                </div>
              )}

              {!loading && !error && results.length > 0 ? (
                results.map((result) => (
                  <div key={result.chunkId} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-2 text-right"> عنوان سند: {result.documentTitle}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-right">{result.text}</p>
                    {/* <p className="text-sm text-slate-600 dark:text-slate-400 text-right">{result.snippet || result.text}</p> */}
                    <p className="text-xs text-slate-400 mt-2 text-right">امتیاز: {result.score.toFixed(2)}</p>
                  </div>
                ))
              ) : !loading && !error && results.length === 0 && searchQuery && (
                <div className="text-center py-12 text-slate-500">هیچ نتیجه‌ای یافت نشد</div>
              )}
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}
