"use client";
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { UserDashboardLayout } from '../../../components/UserDashboardLayout';
import { DocumentDetail } from '../../DocumentDetail';

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  return (
    <ProtectedRoute requiredRole={['VIEWER', 'EDITOR']}>
      <UserDashboardLayout>
        <DocumentDetail />
      </UserDashboardLayout>
    </ProtectedRoute>
  );
}