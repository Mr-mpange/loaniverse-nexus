import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const DashboardRedirect = () => {
  const { userRole, isLoading, user } = useAuth();



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }



  // Redirect to role-specific dashboard
  switch (userRole) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'loan_officer':
      return <Navigate to="/loan-officer" replace />;
    case 'trader':
      return <Navigate to="/trader" replace />;
    case 'compliance_officer':
      return <Navigate to="/compliance" replace />;
    case null:
    case undefined:
      // Default to analytics dashboard if no role is assigned
      return <Navigate to="/analytics" replace />;
    default:
      // Default to analytics dashboard for unknown roles
      return <Navigate to="/analytics" replace />;
  }
};