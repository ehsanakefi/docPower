"use client";
import { FileText, Calendar, Building2, Layers } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Document } from '../data/mockData';
import { useRouter } from 'next/navigation';

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
          <Badge
            variant={document.status === 'active' ? 'default' : 'secondary'}
            className={
              document.status === 'active'
                ? 'bg-[#10B981] hover:bg-[#059669]'
                : 'bg-slate-400'
            }
          >
            {document.status === 'active' ? 'فعال' : 'منسوخ'}
          </Badge>
          <div className="text-right flex-1 mr-3">
            <p className="text-sm text-slate-500 mb-1">{document.code}</p>
            <h3 className="font-semibold text-lg dark:text-white mb-1">
              {document.titlePersian}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {document.title}
            </p>
          </div>
        </div>

        {/* Snippet */}
        <p className="text-sm text-slate-600 dark:text-slate-300 text-right mb-4 line-clamp-2">
          {document.snippetPersian}
        </p>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {document.articleCount} ماده
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {document.approvalDate}
            </span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
              {document.issuingBodyPersian}
            </span>
            <Building2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {document.technicalDomainPersian}
            </span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Keywords */}
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          {document.keywords.map((keyword, idx) => (
            <span
              key={idx}
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded"
            >
              {keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
