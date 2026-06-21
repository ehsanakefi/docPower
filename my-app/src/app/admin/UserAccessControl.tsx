import { useState, useEffect } from "react";
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
import api from "../services/api";

type UserRole = "admin" | "editor" | "viewer";

type User = {
  id: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    inactiveUsers: 0
  });
  const [loading, setLoading] = useState(true);

  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "viewer" as UserRole,
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        toast.error('خطا در بارگذاری کاربران');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('خطا در بارگذاری کاربران');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.getUserStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

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

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.email) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }

    try {
      const response = await api.createUser(newUser);
      if (response.success) {
        toast.success(`کاربر ${newUser.name} با موفقیت اضافه شد`);
        setIsAddUserOpen(false);
        setNewUser({
          name: "",
          username: "",
          email: "",
          role: "viewer",
        });
        fetchUsers();
        fetchStats();
      } else {
        toast.error(response.message || 'خطا در ایجاد کاربر');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('خطا در ایجاد کاربر');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const response = await api.toggleUserStatus(user.id);
      if (response.success) {
        const newStatus = user.status === "active" ? "غیرفعال" : "فعال";
        toast.success(`وضعیت کاربر ${user.name} به ${newStatus} تغییر یافت`);
        fetchUsers();
        fetchStats();
      } else {
        toast.error('خطا در تغییر وضعیت کاربر');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('خطا در تغییر وضعیت کاربر');
    }
  };

  const handleChangeRole = async (user: User, newRole: UserRole) => {
    try {
      const response = await api.updateUserRole(user.id, newRole);
      if (response.success) {
        toast.success(`نقش کاربر ${user.name} تغییر یافت`);
        fetchUsers();
        fetchStats();
      } else {
        toast.error('خطا در تغییر نقش کاربر');
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error('خطا در تغییر نقش کاربر');
    }
  };

  const statsDisplay = [
    { label: "کل کاربران", value: stats.totalUsers.toLocaleString('fa-IR'), icon: Users, color: "bg-blue-500" },
    { label: "کاربران فعال", value: stats.activeUsers.toLocaleString('fa-IR'), icon: Unlock, color: "bg-emerald-500" },
    { label: "مدیران", value: stats.adminUsers.toLocaleString('fa-IR'), icon: Shield, color: "bg-purple-500" },
    { label: "غیرفعال", value: stats.inactiveUsers.toLocaleString('fa-IR'), icon: Lock, color: "bg-slate-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          مدیریت کاربران و دسترسی‌ها
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          کنترل نقش‌ها و سطح دسترسی کاربران
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsDisplay.map((stat) => {
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
              className="pr-10 text-right"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="همه نقش‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه نقش‌ها</SelectItem>
                <SelectItem value="admin">مدیر</SelectItem>
                <SelectItem value="editor">ویرایشگر</SelectItem>
                <SelectItem value="viewer">بیننده</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#10B981] hover:bg-[#059669]">
                  <UserPlus className="w-4 h-4 ml-2" />
                  افزودن کاربر
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-right">افزودن کاربر جدید</DialogTitle>
                  <DialogDescription className="text-right">
                    اطلاعات کاربر جدید را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label className="text-right block mb-2">نام کامل</Label>
                    <Input
                      placeholder="مثال: احمد محمدی"
                      className="text-right"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-right block mb-2">نام کاربری</Label>
                    <Input
                      placeholder="مثال: a.mohammadi"
                      className="text-right"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-right block mb-2">ایمیل</Label>
                    <Input
                      type="email"
                      placeholder="example@domain.com"
                      className="text-right"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-right block mb-2">نقش</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser({ ...newUser, role: value as UserRole })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">بیننده</SelectItem>
                        <SelectItem value="editor">ویرایشگر</SelectItem>
                        <SelectItem value="admin">مدیر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddUserOpen(false)}
                  >
                    انصراف
                  </Button>
                  <Button
                    className="bg-[#10B981] hover:bg-[#059669]"
                    onClick={handleAddUser}
                  >
                    افزودن کاربر
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            لیست کاربران
          </h3>
        </div>
        <div className="overflow-x-auto">
          {loading && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                در حال بارگذاری...
              </p>
            </div>
          )}

          {!loading && filteredUsers.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell className="font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </TableCell>
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
          )}
        </div>

        {!loading && filteredUsers.length === 0 && (
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
