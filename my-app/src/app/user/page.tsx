"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { UserDashboardLayout } from '../components/UserDashboardLayout';
import { Dashboard } from './Dashboard';

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <UserDashboardLayout>
        <Dashboard />
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}