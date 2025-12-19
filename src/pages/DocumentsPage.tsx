import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { DocumentGenerator } from "@/components/sections/DocumentGenerator";
import { useState } from "react";

const DocumentsPage = () => {
  const [activeSection, setActiveSection] = useState("documents");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Document Generator"
          subtitle="LMA-compliant document automation"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <DocumentGenerator />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default DocumentsPage;