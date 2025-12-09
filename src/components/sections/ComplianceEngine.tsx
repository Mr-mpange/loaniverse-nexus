import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  ChevronRight,
  FileText,
  Globe,
  Lock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ComplianceCheck {
  id: string;
  name: string;
  category: string;
  status: "passed" | "warning" | "failed" | "pending";
  jurisdiction: string;
  lastCheck: string;
  details: string;
  priority: "high" | "medium" | "low";
}

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  hash: string;
}

const complianceChecks: ComplianceCheck[] = [
  { id: "1", name: "KYC Verification", category: "Identity", status: "passed", jurisdiction: "US/EU", lastCheck: "2 hours ago", details: "All borrower identities verified", priority: "high" },
  { id: "2", name: "AML Screening", category: "Anti-Money Laundering", status: "passed", jurisdiction: "Global", lastCheck: "1 hour ago", details: "No sanctions matches found", priority: "high" },
  { id: "3", name: "FATCA Compliance", category: "Tax Reporting", status: "warning", jurisdiction: "US", lastCheck: "30 min ago", details: "W-8BEN forms require update for 2 entities", priority: "medium" },
  { id: "4", name: "GDPR Data Handling", category: "Data Privacy", status: "passed", jurisdiction: "EU", lastCheck: "4 hours ago", details: "All data processing compliant", priority: "high" },
  { id: "5", name: "MiFID II Disclosure", category: "Investment Rules", status: "pending", jurisdiction: "EU", lastCheck: "Pending", details: "Awaiting final documentation", priority: "medium" },
  { id: "6", name: "Basel III Capital", category: "Capital Requirements", status: "passed", jurisdiction: "Global", lastCheck: "1 day ago", details: "Capital ratios within limits", priority: "high" },
  { id: "7", name: "ESG Disclosure Requirements", category: "Sustainability", status: "warning", jurisdiction: "EU", lastCheck: "2 hours ago", details: "SFDR classification pending for 3 loans", priority: "medium" },
  { id: "8", name: "Sanctions Screening", category: "Trade Compliance", status: "passed", jurisdiction: "Global", lastCheck: "15 min ago", details: "All parties cleared", priority: "high" },
];

const auditLogs: AuditLog[] = [
  { id: "1", action: "Document Signed", user: "John Anderson", timestamp: "10:32:15", details: "Credit Agreement - Acme Corp", hash: "0x7a8b...3f2c" },
  { id: "2", action: "Compliance Check Passed", user: "System", timestamp: "10:28:42", details: "AML Screening completed", hash: "0x9c4d...8e1a" },
  { id: "3", action: "Trade Executed", user: "Sarah Mitchell", timestamp: "10:25:18", details: "$50M Term Loan B matched", hash: "0x2f6e...7b9d" },
  { id: "4", action: "Risk Alert Generated", user: "System", timestamp: "10:22:30", details: "Covenant breach warning", hash: "0x5a1c...4e8f" },
  { id: "5", action: "Document Updated", user: "Mike Roberts", timestamp: "10:18:55", details: "Amendment #3 revised", hash: "0x8d3b...2a6c" },
];

const statusConfig = {
  passed: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Passed" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Warning" },
  failed: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Failed" },
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Pending" },
};

export function ComplianceEngine() {
  const [activeTab, setActiveTab] = useState<"checks" | "audit">("checks");

  const passedCount = complianceChecks.filter((c) => c.status === "passed").length;
  const warningCount = complianceChecks.filter((c) => c.status === "warning").length;
  const failedCount = complianceChecks.filter((c) => c.status === "failed").length;
  const pendingCount = complianceChecks.filter((c) => c.status === "pending").length;
  const overallScore = Math.round((passedCount / complianceChecks.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Cards */}
      <div className="grid grid-cols-5 gap-4">
        <div className="glass-card p-5 glow-border col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="section-header">Overall Compliance Score</p>
              <p className="text-4xl font-mono font-bold text-foreground mt-2">{overallScore}%</p>
            </div>
            <div className="w-20 h-20 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallScore * 2.51} 251`}
                />
              </svg>
              <Shield className="absolute inset-0 m-auto w-8 h-8 text-success" />
            </div>
          </div>
          <Progress value={overallScore} className="h-2" />
        </div>

        {[
          { label: "Passed", count: passedCount, color: "success" as const },
          { label: "Warnings", count: warningCount, color: "warning" as const },
          { label: "Pending", count: pendingCount, color: "muted-foreground" as const },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 glow-border">
            <p className="section-header">{stat.label}</p>
            <p className={cn("text-3xl font-mono font-bold mt-2", `text-${stat.color}`)}>
              {stat.count}
            </p>
            <p className="text-xs text-muted-foreground mt-1">of {complianceChecks.length} checks</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === "checks" ? "default" : "outline"}
            onClick={() => setActiveTab("checks")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Compliance Checks
          </Button>
          <Button
            variant={activeTab === "audit" ? "default" : "outline"}
            onClick={() => setActiveTab("audit")}
          >
            <Lock className="w-4 h-4 mr-2" />
            Audit Trail
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run All Checks
          </Button>
        </div>
      </div>

      {activeTab === "checks" ? (
        <div className="glass-card glow-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Check</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Jurisdiction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Check</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {complianceChecks.map((check) => {
                const StatusIcon = statusConfig[check.status].icon;
                return (
                  <tr key={check.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", statusConfig[check.status].bg)}>
                          <StatusIcon className={cn("w-4 h-4", statusConfig[check.status].color)} />
                        </div>
                        <span className="font-medium text-foreground">{check.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                        {check.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn("text-xs font-medium px-2 py-1 rounded", statusConfig[check.status].bg, statusConfig[check.status].color)}>
                        {statusConfig[check.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Globe className="w-3 h-3" />
                        {check.jurisdiction}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground max-w-xs truncate">
                      {check.details}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{check.lastCheck}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="iconSm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="iconSm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="glass-card glow-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Blockchain-Secured Audit Trail</h3>
            </div>
            <p className="text-xs text-muted-foreground">Immutable record of all actions</p>
          </div>
          <div className="divide-y divide-border">
            {auditLogs.map((log, index) => (
              <div key={log.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  {index < auditLogs.length - 1 && (
                    <div className="absolute left-5 top-10 w-px h-full bg-border" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{log.action}</p>
                    <span className="font-mono text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">By {log.user}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-primary">{log.hash}</p>
                  <p className="text-[10px] text-muted-foreground">Block Hash</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
