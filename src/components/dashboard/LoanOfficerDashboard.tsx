import {
  DollarSign,
  FileText,
  RefreshCw,
  AlertTriangle,
  Briefcase,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { LoansOverview } from "@/components/dashboard/LoansOverview";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const pendingLoans = [
  { id: 1, borrower: "Acme Corp", amount: "$50M", stage: "Documentation", progress: 65 },
  { id: 2, borrower: "TechFlow Inc", amount: "$25M", stage: "Review", progress: 85 },
  { id: 3, borrower: "Global Industries", amount: "$100M", stage: "Onboarding", progress: 30 },
];

export function LoanOfficerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Loan Officer focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="My Active Loans"
          value="12"
          change="+2 new"
          changeType="positive"
          icon={Briefcase}
          iconColor="primary"
          subtitle="assigned to you"
        />
        <MetricCard
          title="Pending Documents"
          value="8"
          change="4 urgent"
          changeType="negative"
          icon={FileText}
          iconColor="warning"
          subtitle="awaiting review"
        />
        <MetricCard
          title="Loans in Pipeline"
          value="$175M"
          change="+$25M"
          changeType="positive"
          icon={DollarSign}
          iconColor="success"
          subtitle="total value"
        />
        <MetricCard
          title="Covenant Alerts"
          value="2"
          change="Action needed"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="destructive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LoansOverview />
        </div>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Loans in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingLoans.map((loan) => (
              <div key={loan.id} className="p-3 rounded-lg bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-sm">{loan.borrower}</p>
                    <p className="text-xs text-muted-foreground">{loan.amount}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{loan.stage}</Badge>
                </div>
                <Progress value={loan.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{loan.progress}% complete</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              View All Loans
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <RecentDocuments />
      </div>
    </div>
  );
}
