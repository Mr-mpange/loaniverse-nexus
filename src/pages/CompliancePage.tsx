import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ComplianceEngine } from "@/components/sections/ComplianceEngine";
import { useState } from "react";

const CompliancePage = () => {
  const [activeSection, setActiveSection] = useState("compliance");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Compliance Engine"
          subtitle="Regulatory checks & audit trail"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <ComplianceEngine />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default CompliancePage;