import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ReportBuilder } from "@/components/sections/ReportBuilder";
import { useState } from "react";

const ReportsPage = () => {
  const [activeSection, setActiveSection] = useState("reports");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Report Builder"
          subtitle="Generate custom analytics reports"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <ReportBuilder />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default ReportsPage;