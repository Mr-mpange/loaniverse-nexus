import {
  DollarSign,
  FileText,
  ArrowRightLeft,
  AlertTriangle,
  Users,
  Shield,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TradingWidget } from "@/components/dashboard/TradingWidget";
import { ComplianceWidget } from "@/components/dashboard/ComplianceWidget";
import { ESGWidget } from "@/components/dashboard/ESGWidget";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { LoansOverview } from "@/components/dashboard/LoansOverview";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { ScheduledReportsWidget } from "@/components/dashboard/ScheduledReportsWidget";

export function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin sees everything */}
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
          title="Active Users"
          value="47"
          change="+5 new"
          changeType="positive"
          icon={Users}
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
          title="System Alerts"
          value="3"
          change="Action required"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="destructive"
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
