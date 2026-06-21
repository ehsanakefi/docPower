import { useState } from "react";
import { Users, UserPlus, Shield, Lock, Unlock, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
  DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

type UserRole = "admin" | "editor" | "viewer";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLogin: string;
};

export function UserAccessControl() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "viewer" as UserRole,
  });

  const users: User[] = [
    {
      id: 1,
      name: "احمد محمدی",
      username: "a.mohammadi",
      email: "a.mohammadi@example.com",
      role: "admin",
      status: "active",
      lastLogin: "1403/11/19 - 14:30",
    },
    {
      id: 2,
      name: "سارا احمدی",
      username: "s.ahmadi",
      email: "s.ahmadi@example.com",
      role: "editor",
      status: "active",
      lastLogin: "1403/11/19 - 13:15",
    },
    {
      id: 3,
      name: "علی رضایی",
      username: "a.karimi",
      email: "a.karimi@example.com",
      role: "viewer",
      status: "active",
      lastLogin: "1403/11/19 - 12:45",
    },
    {
      id: 4,
      name: "مهدی رضایی",
      username: "m.rezaei",
      email: "m.rezaei@example.com",
      role: "editor",
      status: "active",
      lastLogin: "1403/11/18 - 16:20",
    },
    {
      id: 5,
      name: "فاطمه نوری",
      username: "f.nouri",
      email: "f.nouri@example.com",
      role: "viewer",
      status: "inactive",
      lastLogin: "1403/11/10 - 09:30",
    },
    {
      id: 6,
      name: "حسین صادقی",
      username: "h.sadeghi",
      email: "h.sadeghi@example.com",
      role: "admin",
      status: "active",
      lastLogin: "1403/11/19 - 11:00",
    },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            مدیر
          </Badge>
        );
      case "editor":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            ویرایشگر
          </Badge>
        );
      case "viewer":
        return (
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            بیننده
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    if (status === "active") {
      return (
        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          فعال
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
        غیرفعال
      </Badge>
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.includes(searchQuery) ||
      user.username.includes(searchQuery) ||
      user.email.includes(searchQuery);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.username || !newUser.email) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }

    toast.success(`کاربر ${newUser.name} با موفقیت اضافه شد`);
    setIsAddUserOpen(false);
    setNewUser({
      name: "",
      username: "",
      email: "",
      role: "viewer",
    });
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === "active" ? "غیرفعال" : "فعال";
    toast.success(`وضعیت کاربر ${user.name} به ${newStatus} تغییر یافت`);
  };

  const handleChangeRole = (user: User, newRole: UserRole) => {
    toast.success(`نقش کاربر ${user.name} تغییر یافت`);
  };

  const stats = [
    { label: "کل کاربران", value: "156", icon: Users, color: "bg-blue-500" },
    { label: "کاربران فعال", value: "142", icon: Unlock, color: "bg-emerald-500" },
    { label: "مدیران", value: "8", icon: Shield, color: "bg-red-500" },
    { label: "غیرفعال", value: "14", icon: Lock, color: "bg-slate-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              کنترل دسترسی کاربران
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              مدیریت کاربران و سطوح دسترسی
            </p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <UserPlus className="w-4 h-4" />
                افزودن کاربر جدید
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>افزودن کاربر جدید</DialogTitle>
                <DialogDescription>
                  اطلاعات کاربر جدید را وارد کنید
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="name">نام و نام خانوادگی</Label>
                  <Input
                    id="name"
                    placeholder="مثال: احمد محمدی"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="username">نام کاربری</Label>
                  <Input
                    id="username"
                    placeholder="مثال: a.mohammadi"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">نقش کاربر</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">مدیر</SelectItem>
                      <SelectItem value="editor">ویرایشگر</SelectItem>
                      <SelectItem value="viewer">بیننده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                  افزودن کاربر
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
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
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="جستجو بر اساس نام، نام کاربری یا ایمیل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="فیلتر نقش" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه نقش‌ها</SelectItem>
              <SelectItem value="admin">مدیر</SelectItem>
              <SelectItem value="editor">ویرایشگر</SelectItem>
              <SelectItem value="viewer">بیننده</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">شناسه</TableHead>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">نام کاربری</TableHead>
                <TableHead className="text-right">ایمیل</TableHead>
                <TableHead className="text-right">نقش</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right">آخرین ورود</TableHead>
                <TableHead className="text-right">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {user.email}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleChangeRole(user, value as UserRole)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">مدیر</SelectItem>
                          <SelectItem value="editor">ویرایشگر</SelectItem>
                          <SelectItem value="viewer">بیننده</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === "active" ? (
                          <Lock className="w-4 h-4 text-red-600" />
                        ) : (
                          <Unlock className="w-4 h-4 text-emerald-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              هیچ کاربری یافت نشد
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
