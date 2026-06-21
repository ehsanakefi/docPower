"use client";
import { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { UserDashboardLayout } from '../../components/UserDashboardLayout';
import { SearchResultCard } from '../../usercomponents/SearchResultCard';
import { FilterSidebar } from '../../usercomponents/FilterSidebar';
import { mockDocuments } from '../../data/mockData';

export default function UserSearchPage() {
  const [filters, setFilters] = useState({
    documentCode: '',
    approvalDate: '',
    issuingBodies: [] as string[],
    technicalDomains: [] as string[],
  });

  // Filter documents based on current filters
  const filteredDocuments = mockDocuments.filter(doc => {
    if (filters.documentCode && !doc.code.includes(filters.documentCode)) {
      return false;
    }
    if (filters.issuingBodies.length > 0 && !filters.issuingBodies.includes(doc.issuingBody)) {
      return false;
    }
    if (filters.technicalDomains.length > 0 && !filters.technicalDomains.includes(doc.technicalDomain)) {
      return false;
    }
    return true;
  });

  return (
    <ProtectedRoute requiredRole="user">
      <UserDashboardLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            جستجو در اسناد
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map(document => (
                  <SearchResultCard key={document.id} document={document} />
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  هیچ سندی یافت نشد
                </div>
              )}
            </div>
          </div>
        </div>
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}