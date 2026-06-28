import { useState, DragEvent } from "react";
import { CloudUpload, FileText, CheckCircle, Loader2, X } from "lucide-react";
import api from "../services/api";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";

type UploadStage = "idle" | "uploading" | "complete";

export function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    doc_code: "",
    issue_date: "",
  });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.docx')) {
      setFile(droppedFile);
      toast.success("فایل با موفقیت انتخاب شد");
    } else {
      toast.error("لطفا فقط فایل .docx بارگذاری کنید");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
      toast.success("فایل با موفقیت انتخاب شد");
    } else {
      toast.error("لطفا فقط فایل .docx بارگذاری کنید");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("لطفا یک فایل انتخاب کنید");
      return;
    }

    if (!formData.title || !formData.doc_code || !formData.issue_date) {
      toast.error("لطفا تمام فیلدهای الزامی را پر کنید");
      return;
    }

    setUploadStage("uploading");
    setProgress(0);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('title', formData.title);
    uploadFormData.append('doc_code', formData.doc_code);
    uploadFormData.append('issue_date', formData.issue_date);

    try {
      // Simulate progress
      // const progressInterval = setInterval(() => {
      //   setProgress((prev) => Math.min(prev + 10, 90));
      // }, 200);
      const response = await api.uploadDocument(uploadFormData, (percent) => {
    setProgress(percent);
  });
      // const response = await api.uploadDocument(uploadFormData);

      // clearInterval(progressInterval);
      // setProgress(100);

      if (response.success) {
        setUploadStage("complete");
        toast.success("سند با موفقیت بارگذاری و پردازش شد");
        
        // Reset after 2 seconds
        setTimeout(() => {
          setUploadStage("idle");
          setProgress(0);
          setFile(null);
          setFormData({
            title: "",
            doc_code: "",
            issue_date: "",
          });
        }, 2000);
      } else {
        setUploadStage("idle");
        setProgress(0);
        toast.error(response.error || "خطا در بارگذاری سند");
      }
    } catch (error) {
      setUploadStage("idle");
      setProgress(0);
      toast.error("خطا در ارتباط با سرور");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          بارگذاری سند جدید
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          بارگذاری و ثبت اطلاعات اسناد فنی و اداری
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Zone */}
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              بارگذاری فایل
            </h3>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FileText className="w-16 h-16 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4 ml-2" />
                    حذف فایل
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <CloudUpload className="w-16 h-16 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 mb-2">
                      فایل Word خود را اینجا بکشید
                    </p>
                    <p className="text-sm text-slate-500">یا</p>
                  </div>
                  <label>
                    <input
                      type="file"
                      className="hidden"
                      accept=".docx"
                      onChange={handleFileInput}
                      disabled={uploadStage !== "idle"}
                    />
                    <Button type="button" variant="outline" asChild>
                      <span>انتخاب فایل</span>
                    </Button>
                  </label>
                  <p className="text-xs text-slate-500">
                    فقط فایل‌های .docx (حداکثر 50MB)
                  </p>
                </div>
              )}
            </div>

            {/* Progress */}
            {uploadStage !== "idle" && (
              <div className="mt-6 space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="space-y-2">
                  {uploadStage === "uploading" && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>در حال بارگذاری و پردازش...</span>
                    </div>
                  )}
                  {uploadStage === "complete" && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>تکمیل شد!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Metadata Form */}
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              اطلاعات متادیتا
            </h3>

            <div className="space-y-4">
              {/* Document Title */}
              <div>
                <Label htmlFor="title">عنوان سند *</Label>
                <Input
                  id="title"
                  placeholder="مثال: دستورالعمل مدیریت دانش سازمانی"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              {/* Document Code */}
              <div>
                <Label htmlFor="code">کد سند *</Label>
                <Input
                  id="code"
                  placeholder="مثال: TAV112-02/00"
                  value={formData.doc_code}
                  onChange={(e) => setFormData({ ...formData, doc_code: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              {/* Issue Date */}
              <div>
                <Label htmlFor="date">تاریخ صدور (شمسی) *</Label>
                <Input
                  id="date"
                  placeholder="مثال: 1402/11/15"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={uploadStage !== "idle"}
              >
                {uploadStage !== "idle" ? "در حال پردازش..." : "بارگذاری و ثبت سند"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
