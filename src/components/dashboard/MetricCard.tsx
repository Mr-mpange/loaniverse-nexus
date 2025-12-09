import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "warning" | "destructive" | "esg";
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "primary",
  subtitle,
}: MetricCardProps) {
  return (
    <div className="glass-card p-5 glow-border animate-fade-in hover:bg-card/90 transition-colors">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="section-header">{title}</p>
          <p className="metric-value text-foreground">{value}</p>
          {(change || subtitle) && (
            <div className="flex items-center gap-2">
              {change && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    changeType === "positive" && "text-success",
                    changeType === "negative" && "text-destructive",
                    changeType === "neutral" && "text-muted-foreground"
                  )}
                >
                  {changeType === "positive" && <TrendingUp className="w-3 h-3" />}
                  {changeType === "negative" && <TrendingDown className="w-3 h-3" />}
                  {change}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            iconColor === "primary" && "bg-primary/10 text-primary",
            iconColor === "success" && "bg-success/10 text-success",
            iconColor === "warning" && "bg-warning/10 text-warning",
            iconColor === "destructive" && "bg-destructive/10 text-destructive",
            iconColor === "esg" && "bg-esg/10 text-esg"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
