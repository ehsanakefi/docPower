import { FileText, Upload, Eye, TrendingUp } from "lucide-react";
import { Card } from "../components/ui/card";

export function Overview() {
  const stats = [
    {
      label: "کل اسناد",
      value: "1,234",
      icon: FileText,
      color: "bg-blue-500",
      trend: "+12.5%",
    },
    {
      label: "بارگذاری امروز",
      value: "23",
      icon: Upload,
      color: "bg-emerald-500",
      trend: "+5.2%",
    },
    {
      label: "بازدید امروز",
      value: "456",
      icon: Eye,
      color: "bg-purple-500",
      trend: "+18.3%",
    },
    {
      label: "رشد ماهانه",
      value: "89%",
      icon: TrendingUp,
      color: "bg-orange-500",
      trend: "+3.1%",
    },
  ];

  const recentDocuments = [
    {
      id: 1,
      title: "دستورالعمل مدیریت دانش",
      code: "TAV112-02/00",
      date: "1403/11/19",
      status: "منتشر شده",
    },
    {
      id: 2,
      title: "آیین‌نامه اداری",
      code: "TAV115-05/01",
      date: "1403/11/18",
      status: "پیش‌نویس",
    },
    {
      id: 3,
      title: "استاندارد ایمنی",
      code: "TAV120-03/00",
      date: "1403/11/17",
      status: "منتشر شده",
    },
  ];

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
                    کد: {doc.code}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {doc.date}
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    doc.status === "منتشر شده"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
