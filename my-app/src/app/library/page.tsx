"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/DashboardLayout';
import { DocumentLibrary } from '../admin/DocumentLibrary';

export default function LibraryPage() {
  return (
    <ProtectedRoute requiredRole= {['ADMIN']}>
      <DashboardLayout>
        <DocumentLibrary />
      </DashboardLayout>
    </ProtectedRoute>
  );
}