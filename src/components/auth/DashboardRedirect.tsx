import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const DashboardRedirect = () => {
  const { userRole, isLoading, user } = useAuth();

  // Add debugging
  console.log('DashboardRedirect - userRole:', userRole, 'isLoading:', isLoading, 'user:', user?.email);

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
      console.log('Redirecting to admin dashboard');
      return <Navigate to="/admin" replace />;
    case 'loan_officer':
      console.log('Redirecting to loan officer dashboard');
      return <Navigate to="/loan-officer" replace />;
    case 'trader':
      console.log('Redirecting to trader dashboard');
      return <Navigate to="/trader" replace />;
    case 'compliance_officer':
      console.log('Redirecting to compliance dashboard');
      return <Navigate to="/compliance" replace />;
    case null:
    case undefined:
      console.log('No role found, redirecting to role selection. UserRole was:', userRole);
      // Redirect to role selection if no role is assigned
      return <Navigate to="/select-role" replace />;
    default:
      console.log('Unknown role, redirecting to role selection. UserRole was:', userRole);
      // Redirect to role selection for unknown roles
      return <Navigate to="/select-role" replace />;
  }
};