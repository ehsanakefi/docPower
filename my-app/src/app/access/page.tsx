"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DashboardLayout } from '../components/DashboardLayout';
import { UserAccessControl } from '../admin/UserAccessControl';

export default function AccessPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <UserAccessControl />
      </DashboardLayout>
    </ProtectedRoute>
  );
}