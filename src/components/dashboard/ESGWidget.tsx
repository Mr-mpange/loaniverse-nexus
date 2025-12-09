import { Leaf, TrendingUp, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ESGMetric {
  label: string;
  score: number;
  maxScore: number;
  trend: "up" | "down" | "stable";
}

const esgMetrics: ESGMetric[] = [
  { label: "Environmental", score: 82, maxScore: 100, trend: "up" },
  { label: "Social", score: 74, maxScore: 100, trend: "up" },
  { label: "Governance", score: 89, maxScore: 100, trend: "stable" },
];

export function ESGWidget() {
  const overallScore = Math.round(
    esgMetrics.reduce((acc, m) => acc + m.score, 0) / esgMetrics.length
  );

  return (
    <div className="glass-card p-5 glow-border overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-esg/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-esg/10 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-esg" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">ESG Intelligence</h3>
              <p className="text-xs text-muted-foreground">Portfolio sustainability</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4 text-esg" />
              <span className="text-xs font-medium text-esg">A Rating</span>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="hsl(var(--esg))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${overallScore * 2.51} 251`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-mono font-bold text-foreground">
                {overallScore}
              </span>
              <span className="text-[10px] text-muted-foreground">ESG Score</span>
            </div>
          </div>
        </div>

        {/* Individual Metrics */}
        <div className="space-y-3">
          {esgMetrics.map((metric) => (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono font-medium text-foreground">
                    {metric.score}
                  </span>
                  {metric.trend === "up" && (
                    <TrendingUp className="w-3 h-3 text-success" />
                  )}
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-esg to-success rounded-full transition-all duration-500"
                  style={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-esg hover:text-esg/80 font-medium transition-colors">
          View ESG Dashboard →
        </button>
      </div>
    </div>
  );
}
