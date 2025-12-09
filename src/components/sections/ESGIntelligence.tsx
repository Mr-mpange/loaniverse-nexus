import { useState } from "react";
import {
  Leaf,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle,
  Droplets,
  Wind,
  Users,
  Building,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ESGScore {
  category: string;
  score: number;
  weight: number;
  trend: "up" | "down" | "stable";
  metrics: { name: string; value: string; status: "good" | "warning" | "critical" }[];
}

interface GreenLoan {
  id: string;
  borrower: string;
  amount: string;
  classification: string;
  esgScore: number;
  marginAdjustment: string;
  kpis: string[];
}

const esgScores: ESGScore[] = [
  {
    category: "Environmental",
    score: 82,
    weight: 40,
    trend: "up",
    metrics: [
      { name: "Carbon Emissions", value: "-12% YoY", status: "good" },
      { name: "Renewable Energy Use", value: "67%", status: "good" },
      { name: "Water Management", value: "Moderate", status: "warning" },
    ],
  },
  {
    category: "Social",
    score: 74,
    weight: 30,
    trend: "up",
    metrics: [
      { name: "Employee Diversity", value: "42%", status: "good" },
      { name: "Safety Record", value: "Excellent", status: "good" },
      { name: "Community Impact", value: "Positive", status: "good" },
    ],
  },
  {
    category: "Governance",
    score: 89,
    weight: 30,
    trend: "stable",
    metrics: [
      { name: "Board Independence", value: "75%", status: "good" },
      { name: "Ethics Compliance", value: "Full", status: "good" },
      { name: "Transparency Score", value: "High", status: "good" },
    ],
  },
];

const greenLoans: GreenLoan[] = [
  { id: "1", borrower: "Clean Energy Corp", amount: "$150M", classification: "Green Bond", esgScore: 92, marginAdjustment: "-15bps", kpis: ["50% renewable by 2025", "Net zero by 2030"] },
  { id: "2", borrower: "Sustainable Holdings", amount: "$75M", classification: "Sustainability-Linked", esgScore: 85, marginAdjustment: "-10bps", kpis: ["30% emissions reduction", "100% sustainable supply chain"] },
  { id: "3", borrower: "EcoTech Partners", amount: "$100M", classification: "Social Bond", esgScore: 88, marginAdjustment: "-12bps", kpis: ["10,000 jobs created", "Community investment program"] },
];

const radarData = [
  { subject: "Climate", A: 85, fullMark: 100 },
  { subject: "Water", A: 72, fullMark: 100 },
  { subject: "Biodiversity", A: 68, fullMark: 100 },
  { subject: "Labor", A: 78, fullMark: 100 },
  { subject: "Community", A: 82, fullMark: 100 },
  { subject: "Ethics", A: 91, fullMark: 100 },
];

const trendData = [
  { month: "Jul", score: 76 },
  { month: "Aug", score: 78 },
  { month: "Sep", score: 79 },
  { month: "Oct", score: 81 },
  { month: "Nov", score: 80 },
  { month: "Dec", score: 82 },
];

export function ESGIntelligence() {
  const [activeTab, setActiveTab] = useState<"overview" | "loans" | "reporting">("overview");
  const overallScore = Math.round(esgScores.reduce((acc, s) => acc + (s.score * s.weight) / 100, 0));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ESG Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-5 glow-border col-span-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-esg/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-esg" />
              <span className="text-xs font-medium text-esg">A Rating</span>
            </div>
            <p className="text-4xl font-mono font-bold text-foreground">{overallScore}</p>
            <p className="section-header mt-1">Overall ESG Score</p>
          </div>
        </div>

        {esgScores.map((score) => (
          <div key={score.category} className="glass-card p-5 glow-border">
            <div className="flex items-center justify-between mb-2">
              <p className="section-header">{score.category}</p>
              {score.trend === "up" && <TrendingUp className="w-4 h-4 text-success" />}
            </div>
            <p className="text-2xl font-mono font-bold text-foreground">{score.score}</p>
            <Progress value={score.score} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">{score.weight}% weight</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-5 glow-border">
          <h3 className="font-semibold text-foreground mb-4">ESG Performance Radar</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(217, 33%, 17%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                <Radar name="Score" dataKey="A" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.3} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5 glow-border">
          <h3 className="font-semibold text-foreground mb-4">ESG Score Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="esgGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[70, 90]} stroke="hsl(215, 20%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 47%, 10%)", border: "1px solid hsl(217, 33%, 17%)", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="score" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#esgGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Button variant={activeTab === "overview" ? "default" : "outline"} onClick={() => setActiveTab("overview")}>
          <Leaf className="w-4 h-4 mr-2" />
          ESG Breakdown
        </Button>
        <Button variant={activeTab === "loans" ? "default" : "outline"} onClick={() => setActiveTab("loans")}>
          <Target className="w-4 h-4 mr-2" />
          Green Loans
        </Button>
        <Button variant={activeTab === "reporting" ? "default" : "outline"} onClick={() => setActiveTab("reporting")}>
          <FileText className="w-4 h-4 mr-2" />
          ESG Reporting
        </Button>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-3 gap-6">
          {esgScores.map((category) => (
            <div key={category.category} className="glass-card p-5 glow-border">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", category.category === "Environmental" ? "bg-esg/10" : category.category === "Social" ? "bg-primary/10" : "bg-chart-4/10")}>
                  {category.category === "Environmental" && <Wind className="w-5 h-5 text-esg" />}
                  {category.category === "Social" && <Users className="w-5 h-5 text-primary" />}
                  {category.category === "Governance" && <Building className="w-5 h-5 text-chart-4" />}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{category.category}</h3>
                  <p className="text-sm text-muted-foreground">Score: {category.score}/100</p>
                </div>
              </div>

              <div className="space-y-3">
                {category.metrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      {metric.status === "good" && <CheckCircle className="w-4 h-4 text-success" />}
                      {metric.status === "warning" && <AlertCircle className="w-4 h-4 text-warning" />}
                      <span className="text-sm text-foreground">{metric.name}</span>
                    </div>
                    <span className={cn("text-sm font-medium", metric.status === "good" ? "text-success" : "text-warning")}>
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "loans" && (
        <div className="glass-card glow-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Sustainability-Linked & Green Loans</h3>
            <p className="text-sm text-muted-foreground">Loans with ESG margin adjustments and KPI targets</p>
          </div>
          <div className="divide-y divide-border">
            {greenLoans.map((loan) => (
              <div key={loan.id} className="p-5 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-esg/10 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-esg" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{loan.borrower}</h4>
                      <p className="text-sm text-muted-foreground">{loan.classification}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono font-bold text-foreground">{loan.amount}</p>
                    <p className="text-sm text-esg font-medium">{loan.marginAdjustment} margin</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">ESG Score:</span>
                    <span className="font-mono font-bold text-esg">{loan.esgScore}</span>
                  </div>
                  <Progress value={loan.esgScore} className="flex-1 h-2" />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">KPIs:</span>
                  {loan.kpis.map((kpi, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-esg/10 text-esg">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reporting" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-card p-5 glow-border">
            <h3 className="font-semibold text-foreground mb-4">Auto-Generated ESG Reports</h3>
            <div className="space-y-3">
              {["SFDR Article 8 Disclosure", "TCFD Climate Report", "EU Taxonomy Alignment", "GRI Standards Report"].map((report) => (
                <div key={report} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-esg" />
                    <span className="text-foreground">{report}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-esg transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 glow-border">
            <h3 className="font-semibold text-foreground mb-4">ESG Clause Recommendations</h3>
            <div className="space-y-3">
              {[
                { clause: "Sustainability-Linked Margin Ratchet", impact: "High" },
                { clause: "Green Use of Proceeds Covenant", impact: "High" },
                { clause: "ESG Reporting Obligation", impact: "Medium" },
                { clause: "Climate Risk Disclosure", impact: "Medium" },
              ].map((item) => (
                <div key={item.clause} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-foreground">{item.clause}</span>
                  </div>
                  <span className={cn("text-xs px-2 py-1 rounded", item.impact === "High" ? "bg-success/10 text-success" : "bg-warning/10 text-warning")}>
                    {item.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
