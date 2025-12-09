import { useState } from "react";
import {
  LineChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Loan {
  id: string;
  borrower: string;
  facility: string;
  principal: string;
  outstanding: string;
  maturity: string;
  covenantStatus: "compliant" | "warning" | "breach";
  nextPayment: string;
  paymentAmount: string;
  interestRate: string;
}

interface Covenant {
  id: string;
  name: string;
  metric: string;
  threshold: string;
  current: string;
  status: "compliant" | "warning" | "breach";
  loan: string;
}

const loans: Loan[] = [
  { id: "1", borrower: "Acme Corp", facility: "Term Loan B", principal: "$150M", outstanding: "$142M", maturity: "Mar 2027", covenantStatus: "compliant", nextPayment: "Jan 15, 2025", paymentAmount: "$2.4M", interestRate: "SOFR + 175bps" },
  { id: "2", borrower: "Tech Holdings", facility: "Revolver", principal: "$75M", outstanding: "$45M", maturity: "Jun 2026", covenantStatus: "compliant", nextPayment: "Jan 20, 2025", paymentAmount: "$890K", interestRate: "SOFR + 150bps" },
  { id: "3", borrower: "Global Industries", facility: "Term Loan A", principal: "$200M", outstanding: "$185M", maturity: "Sep 2028", covenantStatus: "warning", nextPayment: "Jan 25, 2025", paymentAmount: "$3.1M", interestRate: "SOFR + 200bps" },
  { id: "4", borrower: "Finance Ltd", facility: "Term Loan B", principal: "$100M", outstanding: "$92M", maturity: "Dec 2026", covenantStatus: "compliant", nextPayment: "Feb 1, 2025", paymentAmount: "$1.8M", interestRate: "SOFR + 125bps" },
];

const covenants: Covenant[] = [
  { id: "1", name: "Total Leverage Ratio", metric: "Debt/EBITDA", threshold: "≤ 4.0x", current: "3.2x", status: "compliant", loan: "Acme Corp" },
  { id: "2", name: "Interest Coverage", metric: "EBITDA/Interest", threshold: "≥ 3.0x", current: "4.5x", status: "compliant", loan: "Tech Holdings" },
  { id: "3", name: "Debt Service Coverage", metric: "Cash Flow/Debt Service", threshold: "≥ 1.25x", current: "1.15x", status: "warning", loan: "Global Industries" },
  { id: "4", name: "Fixed Charge Coverage", metric: "EBITDA/Fixed Charges", threshold: "≥ 1.5x", current: "2.1x", status: "compliant", loan: "Finance Ltd" },
  { id: "5", name: "Current Ratio", metric: "Current Assets/Liabilities", threshold: "≥ 1.0x", current: "1.8x", status: "compliant", loan: "Acme Corp" },
];

const paymentSchedule = [
  { month: "Jan", amount: 8.2, projected: 8.5 },
  { month: "Feb", amount: 7.8, projected: 8.0 },
  { month: "Mar", amount: 9.1, projected: 9.0 },
  { month: "Apr", amount: 8.5, projected: 8.5 },
  { month: "May", amount: 10.2, projected: 10.0 },
  { month: "Jun", amount: 9.8, projected: 9.5 },
];

const portfolioMetrics = [
  { month: "Jul", value: 520 },
  { month: "Aug", value: 535 },
  { month: "Sep", value: 548 },
  { month: "Oct", value: 562 },
  { month: "Nov", value: 545 },
  { month: "Dec", value: 564 },
];

const statusConfig = {
  compliant: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  breach: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
};

export function LoanLifecycle() {
  const [activeTab, setActiveTab] = useState<"overview" | "covenants" | "payments">("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-5 glow-border">
          <p className="section-header">Total Portfolio</p>
          <p className="text-3xl font-mono font-bold text-foreground mt-2">$564M</p>
          <div className="flex items-center gap-1 mt-1 text-success text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>+3.4% this month</span>
          </div>
        </div>
        <div className="glass-card p-5 glow-border">
          <p className="section-header">Active Loans</p>
          <p className="text-3xl font-mono font-bold text-foreground mt-2">47</p>
          <p className="text-xs text-muted-foreground mt-1">Across 32 borrowers</p>
        </div>
        <div className="glass-card p-5 glow-border">
          <p className="section-header">Upcoming Payments</p>
          <p className="text-3xl font-mono font-bold text-foreground mt-2">$8.2M</p>
          <p className="text-xs text-muted-foreground mt-1">Next 30 days</p>
        </div>
        <div className="glass-card p-5 glow-border">
          <p className="section-header">Covenant Alerts</p>
          <p className="text-3xl font-mono font-bold text-warning mt-2">2</p>
          <p className="text-xs text-muted-foreground mt-1">Require attention</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-5 glow-border">
          <h3 className="font-semibold text-foreground mb-4">Portfolio Value Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioMetrics}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 10%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="value" stroke="hsl(217, 91%, 60%)" strokeWidth={2} fill="url(#portfolioGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 glow-border">
          <h3 className="font-semibold text-foreground mb-4">Payment Schedule</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentSchedule}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 10%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                <Bar dataKey="amount" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="projected" fill="hsl(217, 33%, 30%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
          <LineChart className="w-4 h-4 mr-2" />
          Loan Overview
        </Button>
        <Button variant={activeTab === "covenants" ? "default" : "outline"} onClick={() => setActiveTab("covenants")}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Covenant Monitoring
        </Button>
        <Button variant={activeTab === "payments" ? "default" : "outline"} onClick={() => setActiveTab("payments")}>
          <Calendar className="w-4 h-4 mr-2" />
          Payment Schedule
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="glass-card glow-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Borrower</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Facility</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Outstanding</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Rate</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Maturity</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Covenant Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Next Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loans.map((loan) => {
                const StatusIcon = statusConfig[loan.covenantStatus].icon;
                return (
                  <tr key={loan.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">{loan.borrower}</td>
                    <td className="px-4 py-4 text-muted-foreground">{loan.facility}</td>
                    <td className="px-4 py-4 text-right font-mono text-foreground">{loan.outstanding}</td>
                    <td className="px-4 py-4 text-center text-sm text-muted-foreground">{loan.interestRate}</td>
                    <td className="px-4 py-4 text-center text-sm text-muted-foreground">{loan.maturity}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded", statusConfig[loan.covenantStatus].bg, statusConfig[loan.covenantStatus].color)}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{loan.covenantStatus}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="font-mono text-foreground">{loan.paymentAmount}</p>
                      <p className="text-xs text-muted-foreground">{loan.nextPayment}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "covenants" && (
        <div className="glass-card glow-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Covenant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Borrower</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Metric</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Threshold</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Current</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Headroom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {covenants.map((covenant) => {
                const StatusIcon = statusConfig[covenant.status].icon;
                return (
                  <tr key={covenant.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4 font-medium text-foreground">{covenant.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{covenant.loan}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{covenant.metric}</td>
                    <td className="px-4 py-4 text-center font-mono text-muted-foreground">{covenant.threshold}</td>
                    <td className="px-4 py-4 text-center font-mono font-semibold text-foreground">{covenant.current}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded", statusConfig[covenant.status].bg, statusConfig[covenant.status].color)}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{covenant.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Progress value={covenant.status === "compliant" ? 75 : 15} className="h-2 w-20 mx-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
