import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, Building2, TrendingUp, FileText } from 'lucide-react';

const roleOptions: { role: UserRole; label: string; description: string; icon: React.ReactNode }[] = [
  {
    role: 'admin',
    label: 'Administrator',
    description: 'Full system access with all modules and user management',
    icon: <Shield className="h-8 w-8" />,
  },
  {
    role: 'loan_officer',
    label: 'Loan Officer',
    description: 'Manage loan portfolios, documents, and lifecycle processes',
    icon: <Building2 className="h-8 w-8" />,
  },
  {
    role: 'trader',
    label: 'Trader',
    description: 'Access trading board and market analytics',
    icon: <TrendingUp className="h-8 w-8" />,
  },
  {
    role: 'compliance_officer',
    label: 'Compliance Officer',
    description: 'Regulatory oversight, compliance monitoring, and audit tools',
    icon: <FileText className="h-8 w-8" />,
  },
];

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUserRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: selectedRole });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message || 'Failed to assign role');
      }

      // Refresh the user role in the auth context
      await refreshUserRole();
      
      toast({
        title: 'Role assigned successfully',
        description: `You are now a ${roleOptions.find(r => r.role === selectedRole)?.label}`,
      });
      
      // Redirect based on role
      switch (selectedRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'loan_officer':
          navigate('/loan-officer');
          break;
        case 'trader':
          navigate('/trader');
          break;
        case 'compliance_officer':
          navigate('/compliance');
          break;
        default:
          navigate('/analytics');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to assign role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary">Welcome to LMA NEXUS</h1>
          <p className="text-muted-foreground mt-2">Please select your role to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {roleOptions.map((option) => (
            <Card
              key={option.role}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedRole === option.role
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole(option.role)}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-primary">
                  {option.icon}
                </div>
                <CardTitle>{option.label}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? 'Assigning Role...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;