"use client";
import { ProtectedRoute } from '../components/ProtectedRoute';
import { UserDashboardLayout } from '../components/UserDashboardLayout';
import { Dashboard } from './Dashboard';

export default function UserPage() {
  return (
    <ProtectedRoute requiredRole={['VIEWER', 'EDITOR']}>
      <UserDashboardLayout>
        <Dashboard />
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}