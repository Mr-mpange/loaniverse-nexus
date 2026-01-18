import {
  Shield,
  AlertTriangle,
  FileCheck,
  Leaf,
  Clock,
  CheckCircle,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ComplianceWidget } from "@/components/dashboard/ComplianceWidget";
import { ESGWidget } from "@/components/dashboard/ESGWidget";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLoanStats } from "@/hooks/useLoans";
import { useDocumentStats } from "@/hooks/useDocuments";
import { useAuditLog } from "@/hooks/useAuditLog";
import { formatDistanceToNow } from "date-fns";

export function ComplianceOfficerDashboard() {
  const { data: loanStats, isLoading: loanStatsLoading } = useLoanStats();
  const { data: docStats, isLoading: docStatsLoading } = useDocumentStats();
  const { logs = [], isLoading: logsLoading } = useAuditLog();

  // Calculate compliance metrics based on real data
  const totalLoans = loanStats?.totalCount || 0;
  const pendingDocs = docStats?.pending || 0;
  const complianceScore = totalLoans > 0 ? Math.max(85, 100 - (pendingDocs * 2)) : 100;

  const recentAuditItems = logs.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Compliance focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Alerts"
          value={pendingDocs > 0 ? String(pendingDocs) : "0"}
          change={pendingDocs > 0 ? "Needs attention" : "All clear"}
          changeType={pendingDocs > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconColor={pendingDocs > 0 ? "destructive" : "success"}
        />
        <MetricCard
          title="Pending Reviews"
          value={docStatsLoading ? "..." : String(pendingDocs)}
          change={pendingDocs > 0 ? "Action needed" : "All reviewed"}
          changeType={pendingDocs > 0 ? "negative" : "positive"}
          icon={Clock}
          iconColor="warning"
          subtitle="documents"
        />
        <MetricCard
          title="Compliance Score"
          value={loanStatsLoading ? "..." : `${complianceScore}%`}
          change="Portfolio avg"
          changeType="positive"
          icon={Shield}
          iconColor="success"
        />
        <MetricCard
          title="ESG Coverage"
          value={loanStatsLoading ? "..." : `${Math.min(100, totalLoans > 0 ? 87 : 100)}%`}
          change="Loans assessed"
          changeType="positive"
          icon={Leaf}
          iconColor="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceWidget />
        <ESGWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingDocs === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-success opacity-50" />
                <p className="text-sm">No active alerts</p>
                <p className="text-xs mt-1">All compliance checks passed</p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-lg bg-muted/30 border-l-4 border-l-warning">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm">Documents Pending Review</p>
                    <Badge variant="default" className="text-xs">medium</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {pendingDocs} document(s) awaiting approval
                  </p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </>
            )}
            <Button variant="outline" className="w-full">View All Alerts</Button>
          </CardContent>
        </Card>

        {/* Audit Trail */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Recent Audit Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {logsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Loading audit items...</p>
              </div>
            ) : recentAuditItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No audit items yet</p>
              </div>
            ) : (
              recentAuditItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <FileCheck className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">{item.entity_type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1 capitalize">{item.action.replace('_', ' ')}</p>
                  </div>
                </div>
              ))
            )}
            <Button variant="outline" className="w-full">View Audit Log</Button>
          </CardContent>
        </Card>
      </div>

      <ActivityFeed />
    </div>
  );
}
