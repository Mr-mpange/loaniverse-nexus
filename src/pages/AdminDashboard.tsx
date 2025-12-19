import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AdminDashboard as AdminDashboardContent } from "@/components/dashboard/AdminDashboard";
import { TradingBoard } from "@/components/sections/TradingBoard";
import { DocumentGenerator } from "@/components/sections/DocumentGenerator";
import { ComplianceEngine } from "@/components/sections/ComplianceEngine";
import { LoanLifecycle } from "@/components/sections/LoanLifecycle";
import { ESGIntelligence } from "@/components/sections/ESGIntelligence";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { APIIntegrations } from "@/components/sections/APIIntegrations";
import { ReportBuilder } from "@/components/sections/ReportBuilder";
import { AuditLog } from "@/components/sections/AuditLog";
import { TeamManagement } from "@/components/sections/TeamManagement";
import { NotificationSettings } from "@/components/sections/NotificationSettings";
import { ProfileSettings } from "@/components/sections/ProfileSettings";
import { ScheduledReports } from "@/components/sections/ScheduledReports";

const sectionConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Admin Dashboard", subtitle: "System overview and management" },
  analytics: { title: "Analytics", subtitle: "Portfolio performance & risk metrics" },
  documents: { title: "Document Generator", subtitle: "LMA-compliant document automation" },
  trading: { title: "Trading Board", subtitle: "Real-time loan trading marketplace" },
  compliance: { title: "Compliance Engine", subtitle: "Regulatory checks & audit trail" },
  lifecycle: { title: "Loan Lifecycle", subtitle: "Covenant monitoring & payments" },
  esg: { title: "ESG Intelligence", subtitle: "Sustainability scoring & green lending" },
  reports: { title: "Report Builder", subtitle: "Generate custom analytics reports" },
  "scheduled-reports": { title: "Scheduled Reports", subtitle: "Automated report delivery" },
  integrations: { title: "API Integrations", subtitle: "Connect to banking & enterprise systems" },
  audit: { title: "Audit Log", subtitle: "Activity history & event tracking" },
  users: { title: "Team Management", subtitle: "Manage team members and permissions" },
  team: { title: "Team Management", subtitle: "Manage team members and permissions" },
  notifications: { title: "Notifications", subtitle: "Email alerts and notification settings" },
  profile: { title: "Profile Settings", subtitle: "Manage your personal information" },
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboardContent />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "trading":
        return <TradingBoard />;
      case "documents":
        return <DocumentGenerator />;
      case "compliance":
        return <ComplianceEngine />;
      case "lifecycle":
        return <LoanLifecycle />;
      case "esg":
        return <ESGIntelligence />;
      case "integrations":
        return <APIIntegrations />;
      case "reports":
        return <ReportBuilder />;
      case "scheduled-reports":
        return <ScheduledReports />;
      case "audit":
        return <AuditLog />;
      case "users":
      case "team":
        return <TeamManagement />;
      case "notifications":
        return <NotificationSettings />;
      case "profile":
        return <ProfileSettings />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {sectionConfig[activeSection]?.title || "Coming Soon"}
              </h2>
              <p className="text-muted-foreground">
                This module is under development
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={sectionConfig[activeSection]?.title || "LMA NEXUS"}
          subtitle={sectionConfig[activeSection]?.subtitle}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default AdminDashboard;
