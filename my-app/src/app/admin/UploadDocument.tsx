import { useState, DragEvent } from "react";
import { CloudUpload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { JalaliDatePicker } from "../components/JalaliDatePicker";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";
import jMoment from "jalali-moment";

type UploadStage = "idle" | "uploading" | "extracting" | "indexing" | "embedding" | "complete";

export function UploadDocument() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    version: "",
    issueDate: "",
    authority: "",
    tags: "",
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
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      toast.success("فایل با موفقیت انتخاب شد");
    } else {
      toast.error("لطفا فقط فایل PDF بارگذاری کنید");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("فایل با موفقیت انتخاب شد");
    } else {
      toast.error("لطفا فقط فایل PDF بارگذاری کنید");
    }
  };

  const simulateUpload = async () => {
    const stages: UploadStage[] = ["uploading", "extracting", "indexing", "embedding", "complete"];
    
    for (let i = 0; i < stages.length; i++) {
      setUploadStage(stages[i]);
      
      // Simulate progress for each stage
      const startProgress = (i / stages.length) * 100;
      const endProgress = ((i + 1) / stages.length) * 100;
      
      for (let p = startProgress; p <= endProgress; p += 2) {
        setProgress(p);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    toast.success("سند با موفقیت بارگذاری و پردازش شد");
    
    // Reset after 2 seconds
    setTimeout(() => {
      setUploadStage("idle");
      setProgress(0);
      setFile(null);
      setFormData({
        title: "",
        code: "",
        version: "",
        issueDate: "",
        authority: "",
        tags: "",
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("لطفا یک فایل انتخاب کنید");
      return;
    }

    if (!formData.title || !formData.code || !formData.issueDate || !formData.authority) {
      toast.error("لطفا تمام فیلدهای الزامی را پر کنید");
      return;
    }

    simulateUpload();
  };

  const getStageLabel = (stage: UploadStage) => {
    switch (stage) {
      case "uploading":
        return "در حال بارگذاری...";
      case "extracting":
        return "استخراج متن (OCR)...";
      case "indexing":
        return "نمایه‌سازی متادیتا...";
      case "embedding":
        return "تولید Embeddings هوش مصنوعی...";
      case "complete":
        return "تکمیل شد!";
      default:
        return "";
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
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            >
              <CloudUpload className="w-16 h-16 mx-auto mb-4 text-slate-400 dark:text-slate-600" />
              
              {file ? (
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <span className="text-slate-900 dark:text-white font-medium">
                    {file.name}
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    فایل PDF خود را اینجا رها کنید
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    یا برای انتخاب فایل کلیک کنید
                  </p>
                </>
              )}

              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button type="button" variant="outline" className="cursor-pointer" asChild>
                  <span>انتخاب فایل</span>
                </Button>
              </label>
            </div>

            {/* Progress Bar */}
            {uploadStage !== "idle" && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {getStageLabel(uploadStage)}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="grid grid-cols-4 gap-2 mt-4">
                  {["uploading", "extracting", "indexing", "embedding"].map((stage, index) => (
                    <div
                      key={stage}
                      className={`flex items-center gap-2 p-2 rounded ${
                        uploadStage === stage
                          ? "bg-emerald-100 dark:bg-emerald-900/20"
                          : progress > ((index + 1) / 4) * 100
                          ? "bg-slate-100 dark:bg-slate-800"
                          : "bg-slate-50 dark:bg-slate-900"
                      }`}
                    >
                      {uploadStage === stage ? (
                        <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                      ) : progress > ((index + 1) / 4) * 100 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                      )}
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        {getStageLabel(stage as UploadStage)}
                      </span>
                    </div>
                  ))}
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
                  placeholder="مثال: دستورالعمل مدیریت دانش"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Document Code */}
              <div>
                <Label htmlFor="code">کد سند *</Label>
                <Input
                  id="code"
                  placeholder="مثال: TAV112-02/00"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Version */}
              <div>
                <Label htmlFor="version">شماره نسخه/ویرایش</Label>
                <Input
                  id="version"
                  placeholder="مثال: 01"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Issue Date */}
              <div>
                <Label htmlFor="issueDate">تاریخ صدور *</Label>
                <div className="mt-1">
                  <JalaliDatePicker
                    value={formData.issueDate}
                    onChange={(date) => setFormData({ ...formData, issueDate: date })}
                  />
                </div>
              </div>

              {/* Issuing Authority */}
              <div>
                <Label htmlFor="authority">مرجع صادرکننده *</Label>
                <Select
                  value={formData.authority}
                  onValueChange={(value) => setFormData({ ...formData, authority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tavanir">توانیر</SelectItem>
                    <SelectItem value="council">شورای اداری</SelectItem>
                    <SelectItem value="ministry">وزارت نیرو</SelectItem>
                    <SelectItem value="technical">واحد فنی</SelectItem>
                    <SelectItem value="legal">واحد حقوقی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">برچسب‌ها / کلمات کلیدی</Label>
                <Textarea
                  id="tags"
                  placeholder="مثال: مدیریت، دانش، سازمانی، آموزش"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="mt-1"
                  rows={3}
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
