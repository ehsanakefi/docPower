import { Activity, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";

type LogType = "info" | "success" | "warning" | "error";

type LogEntry = {
  id: number;
  type: LogType;
  message: string;
  user: string;
  timestamp: string;
  details?: string;
};

export function SystemLogs() {
  const logs: LogEntry[] = [
    {
      id: 1,
      type: "success",
      message: "سند جدید با موفقیت بارگذاری شد",
      user: "احمد محمدی",
      timestamp: "1403/11/19 - 14:32",
      details: "کد سند: TAV112-02/00",
    },
    {
      id: 2,
      type: "info",
      message: "کاربر جدید به سیستم اضافه شد",
      user: "مدیر سیستم",
      timestamp: "1403/11/19 - 13:15",
      details: "نام کاربری: m.rezaei",
    },
    {
      id: 3,
      type: "warning",
      message: "تلاش ناموفق برای دسترسی به سند محرمانه",
      user: "علی کریمی",
      timestamp: "1403/11/19 - 12:45",
      details: "کد سند: TAV125-06/01",
    },
    {
      id: 4,
      type: "success",
      message: "بک‌آپ خودکار با موفقیت انجام شد",
      user: "سیستم",
      timestamp: "1403/11/19 - 02:00",
      details: "حجم: 2.3 GB",
    },
    {
      id: 5,
      type: "error",
      message: "خطا در پردازش OCR",
      user: "سیستم",
      timestamp: "1403/11/18 - 16:22",
      details: "فایل: document_scan_054.pdf",
    },
    {
      id: 6,
      type: "info",
      message: "سند ویرایش شد",
      user: "سارا احمدی",
      timestamp: "1403/11/18 - 15:10",
      details: "کد سند: TAV118-08/02",
    },
    {
      id: 7,
      type: "success",
      message: "Embeddings جدید تولید شد",
      user: "سیستم",
      timestamp: "1403/11/18 - 14:55",
      details: "تعداد: 15 سند",
    },
    {
      id: 8,
      type: "warning",
      message: "فضای ذخیره‌سازی به 80% رسید",
      user: "سیستم",
      timestamp: "1403/11/18 - 10:30",
      details: "باقیمانده: 200 GB",
    },
    {
      id: 9,
      type: "info",
      message: "کاربر از سیستم خارج شد",
      user: "مهدی رضایی",
      timestamp: "1403/11/18 - 09:15",
    },
    {
      id: 10,
      type: "success",
      message: "سند منتشر شد",
      user: "احمد محمدی",
      timestamp: "1403/11/17 - 16:40",
      details: "کد سند: TAV120-03/00",
    },
  ];

  const getLogIcon = (type: LogType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getLogBadge = (type: LogType) => {
    switch (type) {
      case "success":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
            موفق
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            خطا
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
            هشدار
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            اطلاعات
          </Badge>
        );
    }
  };

  const stats = [
    { label: "کل رویدادها", value: "1,234", color: "bg-blue-500" },
    { label: "رویدادهای امروز", value: "45", color: "bg-emerald-500" },
    { label: "هشدارها", value: "12", color: "bg-amber-500" },
    { label: "خطاها", value: "3", color: "bg-red-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          گزارش‌های سیستم
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          رصد فعالیت‌ها و رویدادهای سیستم
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Logs List */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            آخرین رویدادها
          </h3>
        </div>
        <ScrollArea className="h-[600px]">
          <div className="p-6 space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getLogIcon(log.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {log.details}
                        </p>
                      )}
                    </div>
                    {getLogBadge(log.type)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>کاربر: {log.user}</span>
                    <span>•</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
