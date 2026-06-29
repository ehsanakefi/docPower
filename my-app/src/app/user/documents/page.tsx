"use client";
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { UserDashboardLayout } from '../../components/UserDashboardLayout';
import { DocumentDetail } from '../DocumentDetail';

export default function UserDocumentsPage() {
  return (
    <ProtectedRoute requiredRole={['VIEWER', 'EDITOR']}>
      <UserDashboardLayout>
        <DocumentDetail />
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}