import {
  DollarSign,
  FileText,
  ArrowRightLeft,
  AlertTriangle,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TradingWidget } from "@/components/dashboard/TradingWidget";
import { ComplianceWidget } from "@/components/dashboard/ComplianceWidget";
import { ESGWidget } from "@/components/dashboard/ESGWidget";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { LoansOverview } from "@/components/dashboard/LoansOverview";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ScheduledReportsWidget } from "@/components/dashboard/ScheduledReportsWidget";
import { useLoanStats } from "@/hooks/useLoans";
import { useTradeStats } from "@/hooks/useTrades";

export function AdminDashboard() {
  const { data: loanStats, isLoading: loanStatsLoading } = useLoanStats();
  const { data: tradeStats, isLoading: tradeStatsLoading } = useTradeStats();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin sees everything */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Loan Volume"
          value={loanStatsLoading ? "..." : formatAmount(loanStats?.totalVolume || 0)}
          change={`${loanStats?.totalCount || 0} loans`}
          changeType="positive"
          icon={DollarSign}
          iconColor="primary"
          subtitle="all time"
        />
        <MetricCard
          title="Active Loans"
          value={loanStatsLoading ? "..." : String(loanStats?.activeLoans || 0)}
          change={`${loanStats?.pendingLoans || 0} pending`}
          changeType="positive"
          icon={Users}
          iconColor="success"
          subtitle="in portfolio"
        />
        <MetricCard
          title="Pending Trades"
          value={tradeStatsLoading ? "..." : String(tradeStats?.pendingCount || 0)}
          change={formatAmount(tradeStats?.pendingValue || 0) + " value"}
          changeType="neutral"
          icon={ArrowRightLeft}
          iconColor="warning"
        />
        <MetricCard
          title="System Alerts"
          value="0"
          change="All clear"
          changeType="positive"
          icon={AlertTriangle}
          iconColor="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoansOverview />
        </div>
        <div>
          <ESGWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TradingWidget />
        <ComplianceWidget />
        <ActivityFeed />
        <ScheduledReportsWidget />
      </div>

      <RecentDocuments />
    </div>
  );
}
