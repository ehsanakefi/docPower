import { Calendar, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface FilterSidebarProps {
  filters: {
    documentCode: string;
    approvalDate: string;
    issuingBodies: string[];
    technicalDomains: string[];
  };
  setFilters: (filters: any) => void;
}

export function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const issuingBodies = [
    { id: 'tavanir', label: 'توانیر', labelEn: 'Tavanir' },
    { id: 'council', label: 'شورای اداری توانیر', labelEn: 'Administrative Council' },
    { id: 'technical', label: 'کمیته فنی توانیر', labelEn: 'Technical Committee' },
    { id: 'research', label: 'بخش تحقیقات توانیر', labelEn: 'Research Division' },
  ];

  const technicalDomains = [
    { id: 'gis', label: 'سیستم اطلاعات جغرافیایی', labelEn: 'GIS' },
    { id: 'climate', label: 'آب و هوا', labelEn: 'Climate' },
    { id: 'load', label: 'تخمین بار', labelEn: 'Load Estimation' },
    { id: 'knowledge', label: 'مدیریت دانش', labelEn: 'Knowledge Management' },
    { id: 'reliability', label: 'قابلیت اطمینان', labelEn: 'Reliability' },
  ];

  const toggleIssuingBody = (id: string) => {
    const current = filters.issuingBodies || [];
    const updated = current.includes(id)
      ? current.filter((b: string) => b !== id)
      : [...current, id];
    setFilters({ ...filters, issuingBodies: updated });
  };

  const toggleTechnicalDomain = (id: string) => {
    const current = filters.technicalDomains || [];
    const updated = current.includes(id)
      ? current.filter((d: string) => d !== id)
      : [...current, id];
    setFilters({ ...filters, technicalDomains: updated });
  };

  return (
    <div className="w-80 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0F172A] h-[calc(100vh-73px)]">
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg dark:text-white">فیلترهای پیشرفته</h2>
            <Filter className="w-5 h-5 text-slate-500" />
          </div>

          {/* Document Code */}
          <div className="mb-6">
            <Label className="text-right block mb-2">کد سند</Label>
            <Input
              type="text"
              placeholder="مثال: TAV112-02/00"
              className="text-right"
              value={filters.documentCode}
              onChange={(e) =>
                setFilters({ ...filters, documentCode: e.target.value })
              }
            />
            <p className="text-xs text-slate-500 mt-1 text-right">
              فرمت: کد-شماره/نسخه
            </p>
          </div>

          <Separator className="my-6" />

          {/* Approval Date */}
          <div className="mb-6">
            <Label className="text-right block mb-2">تاریخ تصویب</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1402/11/15"
                className="text-right pr-10"
                value={filters.approvalDate}
                onChange={(e) =>
                  setFilters({ ...filters, approvalDate: e.target.value })
                }
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mt-1 text-right">
              تقویم شمسی (جلالی)
            </p>
          </div>

          <Separator className="my-6" />

          {/* Issuing Body */}
          <div className="mb-6">
            <Label className="text-right block mb-3">مرجع صادرکننده</Label>
            <div className="space-y-3">
              {issuingBodies.map((body) => (
                <div key={body.id} className="flex items-center justify-between">
                  <Checkbox
                    id={body.id}
                    checked={filters.issuingBodies?.includes(body.id)}
                    onCheckedChange={() => toggleIssuingBody(body.id)}
                  />
                  <Label
                    htmlFor={body.id}
                    className="text-sm cursor-pointer flex-1 text-right mr-2"
                  >
                    {body.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Technical Domain */}
          <div className="mb-6">
            <Label className="text-right block mb-3">حوزه فنی</Label>
            <div className="space-y-3">
              {technicalDomains.map((domain) => (
                <div key={domain.id} className="flex items-center justify-between">
                  <Checkbox
                    id={domain.id}
                    checked={filters.technicalDomains?.includes(domain.id)}
                    onCheckedChange={() => toggleTechnicalDomain(domain.id)}
                  />
                  <Label
                    htmlFor={domain.id}
                    className="text-sm cursor-pointer flex-1 text-right mr-2"
                  >
                    {domain.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                setFilters({
                  documentCode: '',
                  approvalDate: '',
                  issuingBodies: [],
                  technicalDomains: [],
                })
              }
            >
              پاک کردن
            </Button>
            <Button className="flex-1 bg-[#10B981] hover:bg-[#059669]">
              اعمال فیلتر
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
