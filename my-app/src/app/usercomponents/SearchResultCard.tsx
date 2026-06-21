"use client";
import { FileText, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  title: string;
  doc_code: string;
  issue_date: string;
  file_url: string;
  sections?: any[];
}

interface SearchResultCardProps {
  document: Document;
}

export function SearchResultCard({ document }: SearchResultCardProps) {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700"
      onClick={() => router.push(`/user/documents/${document.id}`)}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant="default" className="bg-[#10B981] hover:bg-[#059669]">
            فعال
          </Badge>
          <div className="text-right flex-1 mr-3">
            <p className="text-sm text-slate-500 mb-1">{document.doc_code}</p>
            <h3 className="font-semibold text-lg dark:text-white mb-1">
              {document.title}
            </h3>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {document.sections?.length || 0} بخش
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {document.issue_date}
            </span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
