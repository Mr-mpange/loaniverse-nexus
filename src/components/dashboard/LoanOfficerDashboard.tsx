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
import { Skeleton } from "@/components/ui/skeleton";
import { useLoans, useLoanStats } from "@/hooks/useLoans";
import { useDocumentStats } from "@/hooks/useDocuments";
import { useAuth } from "@/hooks/useAuth";

export function LoanOfficerDashboard() {
  const { user } = useAuth();
  const { data: loans = [], isLoading: loansLoading } = useLoans();
  const { data: loanStats, isLoading: statsLoading } = useLoanStats();
  const { data: docStats } = useDocumentStats();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const loansInProgress = loans.filter(l => l.status === 'pending' || l.status === 'review');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Loan Officer focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="My Active Loans"
          value={statsLoading ? "..." : String(loanStats?.activeLoans || 0)}
          change={`${loanStats?.pendingLoans || 0} pending`}
          changeType="neutral"
          icon={Briefcase}
          iconColor="primary"
          subtitle="assigned to you"
        />
        <MetricCard
          title="Pending Documents"
          value={String(docStats?.pending || 0)}
          change={docStats?.pending && docStats.pending > 0 ? "Action needed" : "All clear"}
          changeType={docStats?.pending && docStats.pending > 0 ? "negative" : "positive"}
          icon={FileText}
          iconColor="warning"
          subtitle="awaiting review"
        />
        <MetricCard
          title="Loans in Pipeline"
          value={statsLoading ? "..." : formatAmount(loanStats?.pipelineValue || 0)}
          change={`${loanStats?.pendingLoans || 0} loans`}
          changeType="positive"
          icon={DollarSign}
          iconColor="success"
          subtitle="total value"
        />
        <MetricCard
          title="Covenant Alerts"
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
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Loans in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loansLoading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : loansInProgress.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No loans in progress</p>
                <p className="text-xs mt-1">Create a loan to get started</p>
              </div>
            ) : (
              loansInProgress.slice(0, 3).map((loan) => (
                <div key={loan.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{loan.borrower_name}</p>
                      <p className="text-xs text-muted-foreground">{formatAmount(loan.amount)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{loan.stage}</Badge>
                  </div>
                  <Progress value={loan.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{loan.progress}% complete</p>
                </div>
              ))
            )}
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
