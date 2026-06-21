"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/DashboardLayout';
import { UploadDocument } from '../admin/UploadDocument';

export default function UploadPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <UploadDocument />
      </DashboardLayout>
    </ProtectedRoute>
  );
}