import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { APIIntegrations } from "@/components/sections/APIIntegrations";
import { useState } from "react";

const IntegrationsPage = () => {
  const [activeSection, setActiveSection] = useState("integrations");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="API Integrations"
          subtitle="Connect to banking & enterprise systems"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <APIIntegrations />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default IntegrationsPage;