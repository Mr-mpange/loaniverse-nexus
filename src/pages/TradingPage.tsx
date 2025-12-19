import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { TradingBoard } from "@/components/sections/TradingBoard";
import { useState } from "react";

const TradingPage = () => {
  const [activeSection, setActiveSection] = useState("trading");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Trading Board"
          subtitle="Real-time loan trading marketplace"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <TradingBoard />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default TradingPage;