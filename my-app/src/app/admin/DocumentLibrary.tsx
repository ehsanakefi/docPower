import { useState } from "react";
import { Search, Edit, Trash2, BarChart3, Download, Filter } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { toast } from "sonner";

type Document = {
  id: number;
  title: string;
  code: string;
  uploadDate: string;
  status: "published" | "draft" | "obsolete";
  authority: string;
  views: number;
};

export function DocumentLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const documents: Document[] = [
    {
      id: 1,
      title: "دستورالعمل مدیریت دانش سازمانی",
      code: "TAV112-02/00",
      uploadDate: "1403/11/19",
      status: "published",
      authority: "توانیر",
      views: 342,
    },
    {
      id: 2,
      title: "آیین‌نامه اداری و مالی",
      code: "TAV115-05/01",
      uploadDate: "1403/11/18",
      status: "draft",
      authority: "شورای اداری",
      views: 128,
    },
    {
      id: 3,
      title: "استاندارد ایمنی و بهداشت",
      code: "TAV120-03/00",
      uploadDate: "1403/11/17",
      status: "published",
      authority: "واحد فنی",
      views: 567,
    },
    {
      id: 4,
      title: "دستورالعمل خرید و تدارکات",
      code: "TAV118-08/02",
      uploadDate: "1403/11/15",
      status: "published",
      authority: "واحد مالی",
      views: 234,
    },
    {
      id: 5,
      title: "رویه‌های پرسنلی (منسوخ)",
      code: "TAV105-01/00",
      uploadDate: "1403/09/12",
      status: "obsolete",
      authority: "منابع انسانی",
      views: 89,
    },
    {
      id: 6,
      title: "چارت سازمانی جدید",
      code: "TAV130-10/00",
      uploadDate: "1403/11/14",
      status: "draft",
      authority: "مدیریت",
      views: 45,
    },
    {
      id: 7,
      title: "راهنمای سیستم‌های اطلاعاتی",
      code: "TAV125-06/01",
      uploadDate: "1403/11/10",
      status: "published",
      authority: "IT",
      views: 423,
    },
    {
      id: 8,
      title: "پروتکل‌های امنیتی",
      code: "TAV122-04/00",
      uploadDate: "1403/11/08",
      status: "published",
      authority: "امنیت",
      views: 298,
    },
  ];

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
            منتشر شده
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            پیش‌نویس
          </Badge>
        );
      case "obsolete":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            منسوخ شده
          </Badge>
        );
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.includes(searchQuery) ||
      doc.code.includes(searchQuery) ||
      doc.authority.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (doc: Document) => {
    toast.success(`ویرایش سند: ${doc.title}`);
  };

  const handleDelete = (doc: Document) => {
    toast.error(`حذف سند: ${doc.title}`);
  };

  const handleDownload = (doc: Document) => {
    toast.success(`دانلود سند: ${doc.title}`);
  };

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
              placeholder="جستجو بر اساس عنوان، کد یا مرجع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="فیلتر وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه موارد</SelectItem>
              <SelectItem value="published">منتشر شده</SelectItem>
              <SelectItem value="draft">پیش‌نویس</SelectItem>
              <SelectItem value="obsolete">منسوخ شده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Documents Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شناسه</TableHead>
                <TableHead className="text-right">عنوان سند</TableHead>
                <TableHead className="text-right">کد</TableHead>
                <TableHead className="text-right">مرجع</TableHead>
                <TableHead className="text-right">تاریخ بارگذاری</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">بازدید</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {doc.code}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {doc.authority}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {doc.uploadDate}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {doc.views}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedDoc(doc)}
                          >
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>آمار و تحلیل سند</DialogTitle>
                            <DialogDescription>
                              {selectedDoc?.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <span className="text-slate-700 dark:text-slate-300">
                                تعداد بازدید
                              </span>
                              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {selectedDoc?.views}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <span className="text-slate-700 dark:text-slate-300">
                                تعداد جستجو
                              </span>
                              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {Math.floor((selectedDoc?.views || 0) * 0.7)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <span className="text-slate-700 dark:text-slate-300">
                                تعداد دانلود
                              </span>
                              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                {Math.floor((selectedDoc?.views || 0) * 0.5)}
                              </span>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit className="w-4 h-4 text-emerald-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredDocuments.length === 0 && (
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
