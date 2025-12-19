import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AnalyticsDashboard } from "@/components/sections/AnalyticsDashboard";
import { useState } from "react";

const AnalyticsPage = () => {
  const [activeSection, setActiveSection] = useState("analytics");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Analytics"
          subtitle="Portfolio performance & risk metrics"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <AnalyticsDashboard />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default AnalyticsPage;