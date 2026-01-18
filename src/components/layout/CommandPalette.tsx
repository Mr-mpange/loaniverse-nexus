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
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLoans } from "@/hooks/useLoans";
import { useDocuments } from "@/hooks/useDocuments";
import { useTrades } from "@/hooks/useTrades";

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

export function CommandPalette({ onNavigate }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch real data
  const { data: loans = [], isLoading: loansLoading } = useLoans();
  const { data: documents = [], isLoading: documentsLoading } = useDocuments();
  const { data: trades = [], isLoading: tradesLoading } = useTrades();

  const isLoading = loansLoading || documentsLoading || tradesLoading;

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
    return loans.filter(
      (loan) =>
        loan.borrower_name.toLowerCase().includes(search.toLowerCase()) ||
        loan.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, loans]);

  const filteredDocuments = useMemo(() => {
    if (!search) return [];
    return documents.filter(
      (doc) =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, documents]);

  const filteredTrades = useMemo(() => {
    if (!search) return [];
    return trades.filter(
      (trade) =>
        trade.borrower_name.toLowerCase().includes(search.toLowerCase()) ||
        trade.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, trades]);

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

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
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
        {isLoading && search && (
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        )}

        {!isLoading && !hasResults && <CommandEmpty>No results found.</CommandEmpty>}

        {/* Loans Results */}
        {filteredLoans.length > 0 && (
          <>
            <CommandGroup heading="Loans">
              {filteredLoans.slice(0, 5).map((loan) => (
                <CommandItem
                  key={loan.id}
                  onSelect={() => handleSelect("lifecycle")}
                  className="cursor-pointer"
                >
                  <Building className="mr-2 h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <span className="font-medium">{loan.borrower_name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {loan.id.slice(0, 8)}...
                    </span>
                  </div>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {formatAmount(loan.amount)}
                  </Badge>
                  <Badge
                    variant={loan.status === "active" ? "default" : "secondary"}
                    className="ml-1 text-xs capitalize"
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
              {filteredDocuments.slice(0, 5).map((doc) => (
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
              {filteredTrades.slice(0, 5).map((trade) => (
                <CommandItem
                  key={trade.id}
                  onSelect={() => handleSelect("trading")}
                  className="cursor-pointer"
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <span className="font-medium">{trade.borrower_name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      {trade.id.slice(0, 8)}...
                    </span>
                  </div>
                  <Badge
                    variant={trade.side === "BUY" ? "default" : "secondary"}
                    className="ml-2 text-xs"
                  >
                    {trade.side}
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-1">
                    {formatAmount(trade.amount)} @ {trade.price.toFixed(2)}
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
