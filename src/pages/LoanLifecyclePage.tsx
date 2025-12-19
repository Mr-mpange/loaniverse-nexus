import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { LoanLifecycle } from "@/components/sections/LoanLifecycle";
import { useState } from "react";

const LoanLifecyclePage = () => {
  const [activeSection, setActiveSection] = useState("lifecycle");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Loan Lifecycle"
          subtitle="Covenant monitoring & payments"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <LoanLifecycle />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default LoanLifecyclePage;