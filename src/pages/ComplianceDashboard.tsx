import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ComplianceOfficerDashboard as ComplianceDashboardContent } from "@/components/dashboard/ComplianceOfficerDashboard";
import { ComplianceEngine } from "@/components/sections/ComplianceEngine";
import { ESGIntelligence } from "@/components/sections/ESGIntelligence";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { ReportBuilder } from "@/components/sections/ReportBuilder";
import { AuditLog } from "@/components/sections/AuditLog";
import { NotificationSettings } from "@/components/sections/NotificationSettings";
import { ProfileSettings } from "@/components/sections/ProfileSettings";
import { ScheduledReports } from "@/components/sections/ScheduledReports";

const sectionConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Compliance Dashboard", subtitle: "Regulatory oversight and compliance monitoring" },
  analytics: { title: "Analytics", subtitle: "Compliance metrics & risk analysis" },
  compliance: { title: "Compliance Engine", subtitle: "Regulatory checks & audit trail" },
  esg: { title: "ESG Intelligence", subtitle: "Sustainability scoring & green lending" },
  reports: { title: "Report Builder", subtitle: "Generate compliance reports" },
  "scheduled-reports": { title: "Scheduled Reports", subtitle: "Automated report delivery" },
  audit: { title: "Audit Log", subtitle: "Activity history & event tracking" },
  notifications: { title: "Notifications", subtitle: "Email alerts and notification settings" },
  profile: { title: "Profile Settings", subtitle: "Manage your personal information" },
};

const ComplianceDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <ComplianceDashboardContent />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "compliance":
        return <ComplianceEngine />;
      case "esg":
        return <ESGIntelligence />;
      case "reports":
        return <ReportBuilder />;
      case "scheduled-reports":
        return <ScheduledReports />;
      case "audit":
        return <AuditLog />;
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

export default ComplianceDashboard;