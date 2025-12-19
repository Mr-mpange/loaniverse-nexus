import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ScheduledReports } from "@/components/sections/ScheduledReports";
import { useState } from "react";

const ScheduledReportsPage = () => {
  const [activeSection, setActiveSection] = useState("scheduled-reports");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Scheduled Reports"
          subtitle="Automated report delivery"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <ScheduledReports />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default ScheduledReportsPage;