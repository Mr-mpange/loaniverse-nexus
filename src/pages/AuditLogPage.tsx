import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AuditLog } from "@/components/sections/AuditLog";
import { useState } from "react";

const AuditLogPage = () => {
  const [activeSection, setActiveSection] = useState("audit");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Audit Log"
          subtitle="Activity history & event tracking"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <AuditLog />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default AuditLogPage;