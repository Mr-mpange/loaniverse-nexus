import { useAuth } from "@/hooks/useAuth";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { LoanOfficerDashboard } from "@/components/dashboard/LoanOfficerDashboard";
import { TraderDashboard } from "@/components/dashboard/TraderDashboard";
import { ComplianceOfficerDashboard } from "@/components/dashboard/ComplianceOfficerDashboard";

export function Dashboard() {
  const { userRole } = useAuth();

  // Render role-specific dashboard
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "loan_officer":
      return <LoanOfficerDashboard />;
    case "trader":
      return <TraderDashboard />;
    case "compliance_officer":
      return <ComplianceOfficerDashboard />;
    default:
      // Default to admin dashboard for fallback
      return <AdminDashboard />;
  }
}
