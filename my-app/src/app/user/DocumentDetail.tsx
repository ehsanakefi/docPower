"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../services/api';
import {
  ArrowRight,
  FileText,
  Download,
  Share2,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  doc_code: string;
  issue_date: string;
  file_url: string;
  sections?: any[];
}

export function DocumentDetail() {
  const params = useParams();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadDocument(params.id as string);
    }
  }, [params?.id]);

  const loadDocument = async (id: string) => {
    setLoading(true);
    try {
      const response = await api.getDocumentById(id);
      if (response.success && response.data) {
        setDocument(response.data);
      } else {
        toast.error('خطا در بارگذاری سند');
      }
    } catch (error) {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
            سند یافت نشد
          </h2>
          <p className="text-slate-500 mb-4">
            سند مورد نظر در سیستم موجود نیست.
          </p>
          <Button 
            onClick={() => router.push('/user')} 
            variant="outline"
          >
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <div className="relative">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push('/user')}
              className="gap-2"
            >
              بازگشت
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Left Panel - Document Info */}
          <div className="space-y-6">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">سند</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(document.file_url, '_blank')}>
                      <Download className="w-4 h-4 ml-2" />
                      دانلود
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4 ml-2" />
                      اشتراک
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-right">{document.title}</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {document.doc_code} • {document.issue_date}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">تعداد بخش‌ها: {document.sections?.length || 0}</p>
                  {document.sections && document.sections.length > 0 && (
                    <div className="space-y-1 mt-4">
                      <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">بخش‌های سند:</h4>
                      {document.sections.map((section: any, index: number) => (
                        <p key={index} className="text-sm text-slate-700 dark:text-slate-300 py-1">
                          {index + 1}. {section.title}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Document Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  جزئیات سند
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">کد سند:</span>
                    <span className="font-medium">{document.doc_code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">تاریخ صدور:</span>
                    <span className="font-medium">{document.issue_date}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-slate-600 dark:text-slate-400">تعداد بخش‌ها:</span>
                    <span className="font-medium">{document.sections?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - PDF Viewer */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                نمایش PDF سند اصلی
              </p>
              <p className="text-sm text-slate-500 mb-6">
                {document.doc_code} - {document.title}
              </p>
              <Button onClick={() => window.open(document.file_url, '_blank')}>
                <Download className="w-4 h-4 ml-2" />
                دانلود سند
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
