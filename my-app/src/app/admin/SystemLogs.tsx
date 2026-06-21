import { useEffect, useState } from "react";
import { Activity, AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "sonner";
import api from "../services/api";

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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    todayEvents: 0,
    warnings: 0,
    errors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.getLogs();
      if (response.success && response.data) {
        setLogs(response.data);
      } else {
        toast.error('خطا در بارگذاری گزارش‌ها');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('خطا در بارگذاری گزارش‌ها');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getLogStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching log stats:', error);
    }
  };

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

  const statsDisplay = [
    { label: "کل رویدادها", value: stats.totalEvents.toLocaleString('fa-IR'), color: "bg-blue-500" },
    { label: "رویدادهای امروز", value: stats.todayEvents.toLocaleString('fa-IR'), color: "bg-emerald-500" },
    { label: "هشدارها", value: stats.warnings.toLocaleString('fa-IR'), color: "bg-amber-500" },
    { label: "خطاها", value: stats.errors.toLocaleString('fa-IR'), color: "bg-red-500" },
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
        {statsDisplay.map((stat) => (
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
            {loading && (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  در حال بارگذاری...
                </p>
              </div>
            )}

            {!loading && logs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">
                  هیچ گزارشی یافت نشد
                </p>
              </div>
            )}

            {!loading && logs.map((log) => (
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
