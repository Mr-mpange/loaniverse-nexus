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
import { Progress } from "@/components/ui/progress";

const complianceAlerts = [
  { id: 1, severity: "high", title: "Covenant Breach - Acme Corp", description: "Debt/EBITDA ratio exceeded 4.5x threshold", time: "2 hours ago" },
  { id: 2, severity: "medium", title: "Document Expiry Warning", description: "TechFlow Inc credit agreement expires in 30 days", time: "4 hours ago" },
  { id: 3, severity: "low", title: "ESG Score Update", description: "Global Industries ESG score improved to B+", time: "1 day ago" },
];

const auditItems = [
  { id: 1, type: "Trade", description: "Large trade executed: $50M Acme Corp", status: "pending", time: "1 hr ago" },
  { id: 2, type: "Document", description: "Credit agreement modified", status: "reviewed", time: "3 hrs ago" },
  { id: 3, type: "User", description: "New trader added to system", status: "approved", time: "1 day ago" },
];

export function ComplianceOfficerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Compliance focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Alerts"
          value="5"
          change="2 critical"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="destructive"
        />
        <MetricCard
          title="Pending Reviews"
          value="12"
          change="3 urgent"
          changeType="negative"
          icon={Clock}
          iconColor="warning"
          subtitle="awaiting action"
        />
        <MetricCard
          title="Compliance Score"
          value="94%"
          change="+2%"
          changeType="positive"
          icon={Shield}
          iconColor="success"
          subtitle="portfolio avg"
        />
        <MetricCard
          title="ESG Coverage"
          value="87%"
          change="+5%"
          changeType="positive"
          icon={Leaf}
          iconColor="primary"
          subtitle="loans assessed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Alerts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Compliance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg bg-muted/30 border-l-4 border-l-destructive">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <Badge 
                    variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{alert.description}</p>
                <p className="text-xs text-muted-foreground">{alert.time}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full">View All Alerts</Button>
          </CardContent>
        </Card>

        <ESGWidget />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceWidget />

        {/* Audit Trail */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Recent Audit Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {auditItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`p-2 rounded-lg ${
                  item.status === 'approved' ? 'bg-green-500/10' : 
                  item.status === 'reviewed' ? 'bg-blue-500/10' : 'bg-yellow-500/10'
                }`}>
                  {item.status === 'approved' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : item.status === 'reviewed' ? (
                    <FileCheck className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{item.type}</Badge>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-sm mt-1">{item.description}</p>
                </div>
                <Badge 
                  variant={item.status === 'approved' ? 'default' : 'secondary'}
                  className="text-xs capitalize"
                >
                  {item.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full">View Audit Log</Button>
          </CardContent>
        </Card>
      </div>

      <ActivityFeed />
    </div>
  );
}
