"use client";
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { TopNavigation } from '../usercomponents/TopNavigation';
import { AIAssistant } from '../usercomponents/AIAssistant';
import { SearchResultCard } from '../usercomponents/SearchResultCard';
import { FilterSidebar } from '../usercomponents/FilterSidebar';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  doc_code: string;
  issue_date: string;
  file_url: string;
}

export function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiOpen, setAiOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    documentCode: '',
    approvalDate: '',
    issuingBodies: [] as string[],
    technicalDomains: [] as string[],
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await api.getDocuments();
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        toast.error('خطا در بارگذاری اسناد');
      }
    } catch (error) {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doc_code.includes(searchQuery);

    const matchesCode =
      !filters.documentCode || doc.doc_code.includes(filters.documentCode);

    return matchesSearch && matchesCode;
  });

  return (
    <div className={darkMode ? 'dark' : ''} dir="rtl">
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Top Navigation */}
        <TopNavigation
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main Layout */}
        <div className="flex">
          {/* AI Assistant (Left) */}
          {aiOpen && (
            <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
          )}

          {/* Main Content */}
          <div className="flex-1">
            <div className="p-6">
              {/* AI Toggle Button */}
              {!aiOpen && (
                <div className="mb-6">
                  <Button
                    onClick={() => setAiOpen(true)}
                    className="gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="w-4 h-4" />
                    فعال‌سازی دستیار هوشمند
                  </Button>
                </div>
              )}

              {/* Results Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold dark:text-white mb-2">
                  نتایج جستجو
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {filteredDocuments.length} سند یافت شد
                </p>
              </div>

              {/* Results Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">در حال بارگذاری...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDocuments.map((doc) => (
                      <SearchResultCard key={doc.id} document={doc} />
                    ))}
                  </div>

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-slate-500 dark:text-slate-400">
                        هیچ سندی یافت نشد. لطفا فیلترهای خود را تغییر دهید.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Filter Sidebar (Right) */}
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>
      </div>
    </div>
  );
}
