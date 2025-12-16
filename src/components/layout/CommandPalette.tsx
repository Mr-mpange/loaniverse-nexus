import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  ArrowRightLeft,
  RefreshCw,
  Leaf,
  Shield,
  ClipboardList,
  Plug,
  Calendar,
  Users,
  Bell,
  User,
  Search,
} from "lucide-react";

interface CommandPaletteProps {
  onNavigate: (section: string) => void;
}

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", section: "dashboard" },
  { icon: BarChart3, label: "Analytics", section: "analytics" },
  { icon: FileText, label: "Document Generator", section: "documents" },
  { icon: ArrowRightLeft, label: "Trading Board", section: "trading" },
  { icon: RefreshCw, label: "Loan Lifecycle", section: "lifecycle" },
  { icon: Leaf, label: "ESG Intelligence", section: "esg" },
  { icon: Shield, label: "Compliance Engine", section: "compliance" },
  { icon: ClipboardList, label: "Audit Log", section: "audit" },
  { icon: Plug, label: "API Integrations", section: "integrations" },
  { icon: Calendar, label: "Report Builder", section: "reports" },
  { icon: Calendar, label: "Scheduled Reports", section: "scheduled-reports" },
  { icon: Users, label: "Team Management", section: "team" },
  { icon: Bell, label: "Notifications", section: "notifications" },
  { icon: User, label: "Profile Settings", section: "profile" },
];

const quickActions = [
  { icon: FileText, label: "Generate New Document", section: "documents" },
  { icon: ArrowRightLeft, label: "View Trading Board", section: "trading" },
  { icon: RefreshCw, label: "Onboard New Loan", section: "lifecycle" },
  { icon: Shield, label: "Check Compliance Status", section: "compliance" },
];

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (section: string) => {
    onNavigate(section);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Actions">
          {quickActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => handleSelect(item.section)}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.section}
              onSelect={() => handleSelect(item.section)}
              className="cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
