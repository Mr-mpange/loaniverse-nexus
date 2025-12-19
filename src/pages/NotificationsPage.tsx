import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { NotificationSettings } from "@/components/sections/NotificationSettings";
import { useState } from "react";

const NotificationsPage = () => {
  const [activeSection, setActiveSection] = useState("notifications");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Notifications"
          subtitle="Email alerts and notification settings"
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <NotificationSettings />
        </main>
      </div>

      <CommandPalette onNavigate={setActiveSection} />
    </div>
  );
};

export default NotificationsPage;