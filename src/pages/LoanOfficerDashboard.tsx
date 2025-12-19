import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { LoanOfficerDashboard as LoanOfficerDashboardContent } from "@/components/dashboard/LoanOfficerDashboard";
import { DocumentGenerator } from "@/components/sections/DocumentGenerator";
import { LoanLifecycle } from "@/components/sections/LoanLifecycle";
import { ESGIntelligence } from "@/components/sections/ESGIntelligence";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { ReportBuilder } from "@/components/sections/ReportBuilder";
import { NotificationSettings } from "@/components/sections/NotificationSettings";
import { ProfileSettings } from "@/components/sections/ProfileSettings";
import { ScheduledReports } from "@/components/sections/ScheduledReports";

const sectionConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Loan Officer Dashboard", subtitle: "Manage your loan portfolio" },
  analytics: { title: "Analytics", subtitle: "Portfolio performance & risk metrics" },
  documents: { title: "Document Generator", subtitle: "LMA-compliant document automation" },
  lifecycle: { title: "Loan Lifecycle", subtitle: "Covenant monitoring & payments" },
  esg: { title: "ESG Intelligence", subtitle: "Sustainability scoring & green lending" },
  reports: { title: "Report Builder", subtitle: "Generate custom analytics reports" },
  "scheduled-reports": { title: "Scheduled Reports", subtitle: "Automated report delivery" },
  notifications: { title: "Notifications", subtitle: "Email alerts and notification settings" },
  profile: { title: "Profile Settings", subtitle: "Manage your personal information" },
};

const LoanOfficerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <LoanOfficerDashboardContent />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "documents":
        return <DocumentGenerator />;
      case "lifecycle":
        return <LoanLifecycle />;
      case "esg":
        return <ESGIntelligence />;
      case "reports":
        return <ReportBuilder />;
      case "scheduled-reports":
        return <ScheduledReports />;
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

export default LoanOfficerDashboard;