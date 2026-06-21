"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Search, 
  User, 
  Moon, 
  Sun,
  LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";

interface UserDashboardLayoutProps {
  children: React.ReactNode;
}

export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: "/user", label: "داشبورد", icon: Home },
    { path: "/user/documents", label: "مستندات", icon: FileText },
    { path: "/user/search", label: "جستجو", icon: Search },
  ];

  const isActive = (path: string) => {
    if (path === "/user") return pathname === "/user";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors" dir="rtl">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg z-50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              پنل کاربری
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              خوش آمدید {user?.username}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                    active
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  <span>حالت روز</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  <span>حالت شب</span>
                </>
              )}
            </Button>

            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}