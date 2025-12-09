import {
  DollarSign,
  FileText,
  ArrowRightLeft,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TradingWidget } from "@/components/dashboard/TradingWidget";
import { ComplianceWidget } from "@/components/dashboard/ComplianceWidget";
import { ESGWidget } from "@/components/dashboard/ESGWidget";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { LoansOverview } from "@/components/dashboard/LoansOverview";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Loan Volume"
          value="$4.2B"
          change="+12.5%"
          changeType="positive"
          icon={DollarSign}
          iconColor="primary"
          subtitle="vs last month"
        />
        <MetricCard
          title="Active Documents"
          value="127"
          change="+8 new"
          changeType="positive"
          icon={FileText}
          iconColor="success"
          subtitle="this week"
        />
        <MetricCard
          title="Pending Trades"
          value="23"
          change="$850M value"
          changeType="neutral"
          icon={ArrowRightLeft}
          iconColor="warning"
        />
        <MetricCard
          title="Compliance Alerts"
          value="3"
          change="Action required"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="destructive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2">
          <LoansOverview />
        </div>

        {/* Right Column - ESG */}
        <div>
          <ESGWidget />
        </div>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Widget */}
        <div>
          <TradingWidget />
        </div>

        {/* Compliance Widget */}
        <div>
          <ComplianceWidget />
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* Documents Section */}
      <RecentDocuments />
    </div>
  );
}
