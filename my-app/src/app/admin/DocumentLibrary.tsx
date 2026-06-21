import { useState, useEffect } from "react";
import { Search, Trash2, Download, RefreshCw } from "lucide-react";
import api from "../services/api";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  doc_code: string;
  issue_date: string;
  file_url: string;
  sections?: any[];
}

export function DocumentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (doc: Document) => {
    if (!confirm(`آیا از حذف سند "${doc.title}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const response = await api.deleteDocument(doc.id);
      if (response.success) {
        toast.success('سند با موفقیت حذف شد');
        loadDocuments();
      } else {
        toast.error('خطا در حذف سند');
      }
    } catch (error) {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  const handleDownload = (doc: Document) => {
    window.open(doc.file_url, '_blank');
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.includes(searchQuery) || doc.doc_code.includes(searchQuery)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          کتابخانه اسناد
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          مدیریت و جستجوی اسناد موجود در سیستم
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="جستجو بر اساس عنوان یا کد سند..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <Button onClick={loadDocuments} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${loading ? 'animate-spin' : ''}`} />
            بارگذاری مجدد
          </Button>
        </div>
      </Card>

      {/* Documents Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">در حال بارگذاری...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">ردیف</TableHead>
                  <TableHead className="text-right">عنوان سند</TableHead>
                  <TableHead className="text-right">کد سند</TableHead>
                  <TableHead className="text-right">تاریخ صدور</TableHead>
                  <TableHead className="text-right">تعداد بخش‌ها</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc, index) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {doc.doc_code}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {doc.issue_date}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {doc.sections?.length || 0}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          title="دانلود"
                        >
                          <Download className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc)}
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              هیچ سندی یافت نشد
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
