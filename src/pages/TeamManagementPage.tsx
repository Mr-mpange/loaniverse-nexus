import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { TeamManagement } from "@/components/sections/TeamManagement";
import { useState } from "react";

const TeamManagementPage = () => {
  const [activeSection, setActiveSection] = useState("users");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Team Management"
          subtitle="Manage team members and permissions"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <TeamManagement />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default TeamManagementPage;