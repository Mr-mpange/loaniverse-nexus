import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ProfileSettings } from "@/components/sections/ProfileSettings";
import { useState } from "react";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Profile Settings"
          subtitle="Manage your personal information"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <ProfileSettings />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default ProfilePage;