import { useAuth, UserRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Settings, Shield, Building2, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="h-3 w-3" />,
  loan_officer: <Building2 className="h-3 w-3" />,
  trader: <TrendingUp className="h-3 w-3" />,
  compliance_officer: <FileText className="h-3 w-3" />,
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  loan_officer: 'Loan Officer',
  trader: 'Trader',
  compliance_officer: 'Compliance',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-destructive/20 text-destructive border-destructive/30',
  loan_officer: 'bg-primary/20 text-primary border-primary/30',
  trader: 'bg-success/20 text-success border-success/30',
  compliance_officer: 'bg-warning/20 text-warning border-warning/30',
};

export const UserMenu = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = () => {
    const email = user?.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback className="bg-secondary text-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-foreground truncate">
              {user.email}
            </p>
            {userRole && (
              <Badge variant="outline" className={`w-fit ${roleColors[userRole]}`}>
                <span className="flex items-center gap-1">
                  {roleIcons[userRole]}
                  {roleLabels[userRole]}
                </span>
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        {userRole === 'admin' && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
