import { useEffect, useState, useMemo } from "react";
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
  Building,
  DollarSign,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CommandPaletteProps {
  onNavigate: (section: string) => void;
}

// Mock data for global search
const mockLoans = [
  { id: "L001", borrower: "Acme Corp", amount: "$50M", status: "Active" },
  { id: "L002", borrower: "TechFlow Inc", amount: "$25M", status: "Pending" },
  { id: "L003", borrower: "Global Industries", amount: "$100M", status: "Active" },
  { id: "L004", borrower: "Meridian Holdings", amount: "$75M", status: "Review" },
  { id: "L005", borrower: "Apex Partners", amount: "$30M", status: "Active" },
];

const mockDocuments = [
  { id: "D001", name: "Credit Agreement - Acme Corp", type: "Credit Agreement", date: "2024-01-15" },
  { id: "D002", name: "Term Sheet - TechFlow Inc", type: "Term Sheet", date: "2024-01-10" },
  { id: "D003", name: "Facility Agreement - Global", type: "Facility Agreement", date: "2024-01-08" },
  { id: "D004", name: "Amendment - Meridian", type: "Amendment", date: "2024-01-05" },
];

const mockTrades = [
  { id: "T001", borrower: "Acme Corp", side: "BUY", amount: "$5M", price: "99.25" },
  { id: "T002", borrower: "TechFlow Inc", side: "SELL", amount: "$10M", price: "98.50" },
  { id: "T003", borrower: "Global Industries", side: "BUY", amount: "$2.5M", price: "97.75" },
];

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

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Route mapping for navigation items
  const routeMap: Record<string, string> = {
    dashboard: "/",
    analytics: "/analytics",
    documents: "/documents",
    trading: "/trading",
    compliance: "/compliance-engine",
    lifecycle: "/loan-lifecycle",
    esg: "/esg",
    reports: "/reports",
    "scheduled-reports": "/scheduled-reports",
    integrations: "/integrations",
    audit: "/audit-log",
    users: "/team",
    team: "/team",
    notifications: "/notifications",
    profile: "/profile",
    settings: "/settings",
  };

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

  // Filter results based on search
  const filteredLoans = useMemo(() => {
    if (!search) return [];
    return mockLoans.filter(
      (loan) =>
        loan.borrower.toLowerCase().includes(search.toLowerCase()) ||
        loan.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredDocuments = useMemo(() => {
    if (!search) return [];
    return mockDocuments.filter(
      (doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredTrades = useMemo(() => {
    if (!search) return [];
    return mockTrades.filter(
      (trade) =>
        trade.borrower.toLowerCase().includes(search.toLowerCase()) ||
        trade.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredNavigation = useMemo(() => {
    if (!search) return navigationItems;
    return navigationItems.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelect = (section: string) => {
    const route = routeMap[section];
    if (route) {
      navigate(route);
    }
    // Also call onNavigate for backward compatibility
    onNavigate(section);
    setOpen(false);
    setSearch("");
  };

  const hasResults =
    filteredLoans.length > 0 ||
    filteredDocuments.length > 0 ||
    filteredTrades.length > 0 ||
    filteredNavigation.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search loans, documents, trades, or navigate..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {!hasResults && <CommandEmpty>No results found.</CommandEmpty>}

        {/* Loans Results */}
        {filteredLoans.length > 0 && (
          <>
            <CommandGroup heading="Loans">
              {filteredLoans.map((loan) => (
                <CommandItem
                  key={loan.id}
                  onSelect={() => handleSelect("lifecycle")}
                  className="cursor-pointer"
                >
                  <Building className="mr-2 h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <span className="font-medium">{loan.borrower}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{loan.id}</span>
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {loan.amount}
                  </Badge>
                  <Badge
                    variant={loan.status === "Active" ? "default" : "secondary"}
                    className="ml-1 text-xs"
                  >
                    {loan.status}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Documents Results */}
        {filteredDocuments.length > 0 && (
          <>
            <CommandGroup heading="Documents">
              {filteredDocuments.map((doc) => (
                <CommandItem
                  key={doc.id}
                  onSelect={() => handleSelect("documents")}
                  className="cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <span className="font-medium">{doc.name}</span>
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {doc.type}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Trades Results */}
        {filteredTrades.length > 0 && (
          <>
            <CommandGroup heading="Trades">
              {filteredTrades.map((trade) => (
                <CommandItem
                  key={trade.id}
                  onSelect={() => handleSelect("trading")}
                  className="cursor-pointer"
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <span className="font-medium">{trade.borrower}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{trade.id}</span>
                  </div>
                  <Badge
                    variant={trade.side === "BUY" ? "default" : "secondary"}
                    className="ml-2 text-xs"
                  >
                    {trade.side}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-1">
                    {trade.amount} @ {trade.price}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {/* Navigation */}
        {filteredNavigation.length > 0 && (
          <CommandGroup heading="Navigation">
            {filteredNavigation.slice(0, search ? filteredNavigation.length : 6).map((item) => (
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
        )}
      </CommandList>
    </CommandDialog>
  );
}
