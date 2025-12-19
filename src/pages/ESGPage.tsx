import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ESGIntelligence } from "@/components/sections/ESGIntelligence";
import { useState } from "react";

const ESGPage = () => {
  const [activeSection, setActiveSection] = useState("esg");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="ESG Intelligence"
          subtitle="Sustainability scoring & green lending"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <ESGIntelligence />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default ESGPage;