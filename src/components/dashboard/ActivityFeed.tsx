import { FileText, ArrowRightLeft, Shield, Leaf, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "document" | "trade" | "compliance" | "esg" | "alert";
  title: string;
  description: string;
  time: string;
  status?: "success" | "warning" | "info";
}

const activities: Activity[] = [
  {
    id: "1",
    type: "trade",
    title: "Trade Executed",
    description: "$50M loan for Acme Corp matched at 99.75",
    time: "2 min ago",
    status: "success",
  },
  {
    id: "2",
    type: "compliance",
    title: "Compliance Alert",
    description: "FATCA documentation requires review",
    time: "15 min ago",
    status: "warning",
  },
  {
    id: "3",
    type: "document",
    title: "Document Generated",
    description: "Term Sheet for Tech Holdings ready for review",
    time: "1 hour ago",
    status: "info",
  },
  {
    id: "4",
    type: "esg",
    title: "ESG Score Updated",
    description: "Portfolio ESG rating improved to A",
    time: "2 hours ago",
    status: "success",
  },
  {
    id: "5",
    type: "alert",
    title: "Covenant Breach Warning",
    description: "Global Industries approaching debt ratio limit",
    time: "3 hours ago",
    status: "warning",
  },
];

const typeIcons = {
  document: FileText,
  trade: ArrowRightLeft,
  compliance: Shield,
  esg: Leaf,
  alert: AlertTriangle,
};

export function ActivityFeed() {
  return (
    <div className="glass-card p-5 glow-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Activity Feed</h3>
          <p className="text-xs text-muted-foreground">Recent platform activity</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = typeIcons[activity.type];
          return (
            <div key={activity.id} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    activity.status === "success" && "bg-success/10 text-success",
                    activity.status === "warning" && "bg-warning/10 text-warning",
                    activity.status === "info" && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-full bg-border" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-2 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View All Activity →
      </button>
    </div>
  );
}
