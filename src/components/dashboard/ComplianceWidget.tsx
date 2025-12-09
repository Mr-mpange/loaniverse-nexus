import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ComplianceItem {
  id: string;
  title: string;
  status: "passed" | "warning" | "pending";
  jurisdiction: string;
  lastCheck: string;
}

const complianceItems: ComplianceItem[] = [
  { id: "1", title: "KYC Verification", status: "passed", jurisdiction: "US/EU", lastCheck: "2h ago" },
  { id: "2", title: "AML Screening", status: "passed", jurisdiction: "Global", lastCheck: "1h ago" },
  { id: "3", title: "FATCA Compliance", status: "warning", jurisdiction: "US", lastCheck: "30m ago" },
  { id: "4", title: "ESG Disclosure", status: "pending", jurisdiction: "EU", lastCheck: "Pending" },
];

export function ComplianceWidget() {
  const passedCount = complianceItems.filter((i) => i.status === "passed").length;
  const totalCount = complianceItems.length;
  const score = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="glass-card p-5 glow-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Compliance Status</h3>
          <p className="text-xs text-muted-foreground">Real-time regulatory checks</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-foreground">{score}%</p>
          <p className="text-[10px] text-muted-foreground">Compliance Score</p>
        </div>
      </div>

      <Progress value={score} className="h-2 mb-4" />

      <div className="space-y-2">
        {complianceItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  item.status === "passed" && "bg-success/10",
                  item.status === "warning" && "bg-warning/10",
                  item.status === "pending" && "bg-muted"
                )}
              >
                {item.status === "passed" && (
                  <CheckCircle className="w-4 h-4 text-success" />
                )}
                {item.status === "warning" && (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                )}
                {item.status === "pending" && (
                  <Clock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.jurisdiction}</p>
              </div>
            </div>
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-1 rounded",
                item.status === "passed" && "bg-success/10 text-success",
                item.status === "warning" && "bg-warning/10 text-warning",
                item.status === "pending" && "bg-muted text-muted-foreground"
              )}
            >
              {item.lastCheck}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View Full Compliance Report →
      </button>
    </div>
  );
}
