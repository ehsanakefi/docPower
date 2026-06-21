"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/DashboardLayout';
import { SystemLogs } from '../admin/SystemLogs';

export default function LogsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <SystemLogs />
      </DashboardLayout>
    </ProtectedRoute>
  );
}