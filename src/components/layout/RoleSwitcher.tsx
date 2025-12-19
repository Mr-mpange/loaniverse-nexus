import { useAuth, UserRole } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Building2, TrendingUp, FileText } from 'lucide-react';

const roleRoutes: Record<UserRole, string> = {
  admin: '/admin',
  loan_officer: '/loan-officer',
  trader: '/trader',
  compliance_officer: '/compliance',
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin Dashboard',
  loan_officer: 'Loan Officer Dashboard',
  trader: 'Trader Dashboard',
  compliance_officer: 'Compliance Dashboard',
};

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="h-4 w-4" />,
  loan_officer: <Building2 className="h-4 w-4" />,
  trader: <TrendingUp className="h-4 w-4" />,
  compliance_officer: <FileText className="h-4 w-4" />,
};

export const RoleSwitcher = () => {
  const { userRole, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Only show for admins
  if (!hasRole('admin')) {
    return null;
  }

  const getCurrentRole = (): UserRole => {
    const path = location.pathname;
    const role = Object.entries(roleRoutes).find(([_, route]) => route === path)?.[0] as UserRole;
    return role || 'admin';
  };

  const handleRoleChange = (role: UserRole) => {
    navigate(roleRoutes[role]);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">View as:</span>
      <Select value={getCurrentRole()} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(roleLabels) as UserRole[]).map((role) => (
            <SelectItem key={role} value={role}>
              <div className="flex items-center gap-2">
                {roleIcons[role]}
                <span>{roleLabels[role]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};