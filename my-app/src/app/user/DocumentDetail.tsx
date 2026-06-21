"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowRight,
  FileText,
  Download,
  Share2,
  Sparkles,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { DataTable } from '../usercomponents/DataTable';
import { FormulaView } from '../usercomponents/FormulaView';
import { mockDocuments, mockGISAssets, mockClimateParameters } from '../data/mockData';

export function DocumentDetail() {
  const params = useParams();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const document = mockDocuments.find((doc) => doc.id === params?.id);

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

  // Mock data for tables
  const climateData = mockClimateParameters;
  const gisData = mockGISAssets;

  const climateColumns = [
    { key: 'parameter', label: 'پارامتر' },
    { key: 'value', label: 'مقدار' },
    { key: 'unit', label: 'واحد' },
    { key: 'source', label: 'منبع' },
  ];

  const gisColumns = [
    { key: 'layer', label: 'لایه' },
    { key: 'type', label: 'نوع' },
    { key: 'accuracy', label: 'دقت' },
    { key: 'lastUpdated', label: 'آخرین بروزرسانی' },
  ];

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
          {/* Left Panel - Document Info & Tables */}
          <div className="space-y-6">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="mb-2">
                    {document.issuingBody}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      دانلود
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4 ml-2" />
                      اشتراک
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-right">{document.titlePersian}</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {document.code} • {document.approvalDate}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {document.snippetPersian}
                </p>
              </CardContent>
            </Card>

            {/* Interactive Tables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  داده‌های تعاملی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="climate" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="climate">پارامترهای اقلیمی</TabsTrigger>
                    <TabsTrigger value="gis">داده‌های GIS</TabsTrigger>
                    <TabsTrigger value="formulas">فرمول‌ها</TabsTrigger>
                  </TabsList>

                  <TabsContent value="climate" className="mt-4">
                    <DataTable
                      data={climateData}
                      columns={climateColumns}
                      type="climate"
                    />
                  </TabsContent>

                  <TabsContent value="formulas" className="mt-4">
                    <FormulaView />
                  </TabsContent>

                  <TabsContent value="gis" className="mt-4">
                    <DataTable
                      data={gisData}
                      columns={gisColumns}
                      type="gis"
                    />
                  </TabsContent>
                </Tabs>
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
                {document.code} - {document.titlePersian}
              </p>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm text-right max-w-md mx-auto">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  در محیط واقعی، این بخش شامل نمایش دهنده PDF تعاملی خواهد بود که
                  امکان مرور، بزرگنمایی، جستجو و برجسته‌سازی متن را فراهم می‌کند.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}