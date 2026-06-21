import { useState, useEffect } from "react";
import { FileText, Upload, Eye, TrendingUp } from "lucide-react";
import api from "../services/api";
import { Card } from "../components/ui/card";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  doc_code: string;
  issue_date: string;
}

export function Overview() {
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

  const stats = [
    {
      label: "کل اسناد",
      value: documents.length.toString(),
      icon: FileText,
      color: "bg-blue-500",
      trend: "+12.5%",
    },
    {
      label: "بارگذاری امروز",
      value: "0",
      icon: Upload,
      color: "bg-emerald-500",
      trend: "+0%",
    },
    {
      label: "بازدید امروز",
      value: "-",
      icon: Eye,
      color: "bg-purple-500",
      trend: "-",
    },
    {
      label: "رشد ماهانه",
      value: "-",
      icon: TrendingUp,
      color: "bg-orange-500",
      trend: "-",
    },
  ];

  const recentDocuments = documents.slice(0, 3);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          نمای کلی
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          خلاصه آمار و اطلاعات سیستم مدیریت اسناد
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                    {stat.trend}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Documents */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          اسناد اخیر
        </h3>
        {loading ? (
          <p className="text-slate-500 text-center py-4">در حال بارگذاری...</p>
        ) : recentDocuments.length > 0 ? (
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {doc.title}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      کد: {doc.doc_code}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {doc.issue_date}
                  </p>
                  <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    فعال
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">هیچ سندی موجود نیست</p>
        )}
      </Card>
    </div>
  );
}
