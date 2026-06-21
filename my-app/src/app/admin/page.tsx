"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/DashboardLayout';
import { Overview } from '../admin/Overview';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <Overview />
      </DashboardLayout>
    </ProtectedRoute>
  );
}