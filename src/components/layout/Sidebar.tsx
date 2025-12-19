import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  ArrowRightLeft,
  Shield,
  LineChart,
  Leaf,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Users,
  Bell,
  BarChart3,
  Plug,
  Calendar,
  User,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: "default" | "success" | "warning" | "destructive";
}

// Role-based navigation items
const getNavItemsForRole = (userRole: string | null): NavItem[] => {
  const baseItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  switch (userRole) {
    case 'admin':
      return [
        ...baseItems,
        { id: "documents", label: "Documents", icon: FileText, badge: "3", badgeType: "default" },
        { id: "trading", label: "Trading Board", icon: ArrowRightLeft, badge: "LIVE", badgeType: "success" },
        { id: "compliance", label: "Compliance", icon: Shield },
        { id: "lifecycle", label: "Loan Lifecycle", icon: LineChart, badge: "2", badgeType: "warning" },
        { id: "esg", label: "ESG Intelligence", icon: Leaf },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "scheduled-reports", label: "Scheduled Reports", icon: Calendar },
      ];
    
    case 'loan_officer':
      return [
        ...baseItems,
        { id: "documents", label: "Documents", icon: FileText, badge: "3", badgeType: "default" },
        { id: "lifecycle", label: "Loan Lifecycle", icon: LineChart, badge: "2", badgeType: "warning" },
        { id: "esg", label: "ESG Intelligence", icon: Leaf },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "scheduled-reports", label: "Scheduled Reports", icon: Calendar },
      ];
    
    case 'trader':
      return [
        ...baseItems,
        { id: "trading", label: "Trading Board", icon: ArrowRightLeft, badge: "LIVE", badgeType: "success" },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "scheduled-reports", label: "Scheduled Reports", icon: Calendar },
      ];
    
    case 'compliance_officer':
      return [
        ...baseItems,
        { id: "compliance", label: "Compliance", icon: Shield },
        { id: "esg", label: "ESG Intelligence", icon: Leaf },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "scheduled-reports", label: "Scheduled Reports", icon: Calendar },
      ];
    
    default:
      return baseItems;
  }
};

const getBottomNavItemsForRole = (userRole: string | null): NavItem[] => {
  const baseItems = [
    { id: "notifications", label: "Notifications", icon: Bell, badge: "5", badgeType: "destructive" },
    { id: "profile", label: "Profile", icon: User },
  ];

  if (userRole === 'admin') {
    return [
      { id: "integrations", label: "Integrations", icon: Plug },
      { id: "audit", label: "Audit Log", icon: Shield },
      { id: "users", label: "Team", icon: Users },
      ...baseItems,
      { id: "settings", label: "Settings", icon: Settings },
    ];
  }

  if (userRole === 'compliance_officer') {
    return [
      { id: "audit", label: "Audit Log", icon: Shield },
      ...baseItems,
    ];
  }

  return baseItems;
};

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { userRole } = useAuth();
  
  const navItems = getNavItemsForRole(userRole);
  const bottomNavItems = getBottomNavItemsForRole(userRole);

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;

    return (
      <Button
        key={item.id}
        variant={isActive ? "navActive" : "nav"}
        className={cn(
          "w-full relative group",
          collapsed ? "justify-center px-2" : "px-3"
        )}
        onClick={() => onSectionChange(item.id)}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-semibold rounded",
                  item.badgeType === "success" && "bg-success/20 text-success",
                  item.badgeType === "warning" && "bg-warning/20 text-warning",
                  item.badgeType === "destructive" && "bg-destructive/20 text-destructive",
                  item.badgeType === "default" && "bg-primary/20 text-primary"
                )}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
        {collapsed && item.badge && (
          <span
            className={cn(
              "absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center",
              item.badgeType === "success" && "bg-success text-success-foreground",
              item.badgeType === "warning" && "bg-warning text-warning-foreground",
              item.badgeType === "destructive" && "bg-destructive text-destructive-foreground",
              item.badgeType === "default" && "bg-primary text-primary-foreground"
            )}
          >
            {item.badge === "LIVE" ? "•" : item.badge}
          </span>
        )}
      </Button>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-sm text-foreground">LMA NEXUS</h1>
              <p className="text-[10px] text-muted-foreground">Loan Market OS</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center mx-auto">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Main
            </p>
          )}
          {navItems.map(renderNavItem)}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map(renderNavItem)}
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
