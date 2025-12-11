import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Shield,
  Leaf,
  Activity,
  Target,
} from "lucide-react";

// Portfolio performance data
const portfolioData = [
  { month: "Jan", value: 3200, benchmark: 3100 },
  { month: "Feb", value: 3350, benchmark: 3180 },
  { month: "Mar", value: 3280, benchmark: 3220 },
  { month: "Apr", value: 3520, benchmark: 3300 },
  { month: "May", value: 3680, benchmark: 3380 },
  { month: "Jun", value: 3890, benchmark: 3450 },
  { month: "Jul", value: 3750, benchmark: 3520 },
  { month: "Aug", value: 4020, benchmark: 3600 },
  { month: "Sep", value: 4180, benchmark: 3680 },
  { month: "Oct", value: 4350, benchmark: 3750 },
  { month: "Nov", value: 4520, benchmark: 3820 },
  { month: "Dec", value: 4680, benchmark: 3900 },
];

// Risk metrics data
const riskData = [
  { category: "Credit Risk", value: 65, max: 100, status: "moderate" },
  { category: "Market Risk", value: 42, max: 100, status: "low" },
  { category: "Liquidity Risk", value: 78, max: 100, status: "high" },
  { category: "Operational Risk", value: 35, max: 100, status: "low" },
  { category: "Concentration Risk", value: 58, max: 100, status: "moderate" },
];

// Loan distribution data
const loanDistribution = [
  { name: "Term Loans", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Revolving Credit", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Bridge Loans", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Syndicated Loans", value: 10, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
];

// Trading volume data
const tradingVolume = [
  { day: "Mon", buy: 120, sell: 85 },
  { day: "Tue", buy: 95, sell: 110 },
  { day: "Wed", buy: 150, sell: 130 },
  { day: "Thu", buy: 180, sell: 160 },
  { day: "Fri", buy: 140, sell: 125 },
];

// ESG score trends
const esgTrends = [
  { month: "Q1", environmental: 72, social: 68, governance: 75 },
  { month: "Q2", environmental: 75, social: 70, governance: 78 },
  { month: "Q3", environmental: 78, social: 73, governance: 80 },
  { month: "Q4", environmental: 82, social: 76, governance: 83 },
];

// Sector exposure data
const sectorExposure = [
  { sector: "Technology", exposure: 28 },
  { sector: "Healthcare", exposure: 22 },
  { sector: "Energy", exposure: 18 },
  { sector: "Finance", exposure: 15 },
  { sector: "Manufacturing", exposure: 12 },
  { sector: "Other", exposure: 5 },
];

const chartConfig = {
  value: { label: "Portfolio Value", color: "hsl(var(--chart-1))" },
  benchmark: { label: "Benchmark", color: "hsl(var(--chart-2))" },
  buy: { label: "Buy Orders", color: "hsl(var(--success))" },
  sell: { label: "Sell Orders", color: "hsl(var(--destructive))" },
  environmental: { label: "Environmental", color: "hsl(var(--chart-1))" },
  social: { label: "Social", color: "hsl(var(--chart-2))" },
  governance: { label: "Governance", color: "hsl(var(--chart-3))" },
};

export function AnalyticsDashboard() {
  const getRiskColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-success";
      case "moderate":
        return "bg-warning";
      case "high":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">$4.68B</p>
                <div className="flex items-center gap-1 mt-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+12.4% YTD</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">56/100</p>
                <div className="flex items-center gap-1 mt-1 text-warning">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Moderate Risk</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ESG Score</p>
                <p className="text-2xl font-bold">78/100</p>
                <div className="flex items-center gap-1 mt-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">+8 pts QoQ</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">3 pending reviews</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Portfolio Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="trading">Trading Activity</TabsTrigger>
          <TabsTrigger value="esg">ESG Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Portfolio Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Portfolio Value vs Benchmark</CardTitle>
                <CardDescription>12-month performance comparison ($M)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={portfolioData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Loan Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Distribution</CardTitle>
                <CardDescription>By product type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={loanDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${value}%`}
                      >
                        {loanDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {loanDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics Overview</CardTitle>
                <CardDescription>Current risk exposure by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {riskData.map((risk) => (
                  <div key={risk.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{risk.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{risk.value}%</span>
                        <Badge
                          variant={
                            risk.status === "low"
                              ? "default"
                              : risk.status === "moderate"
                              ? "secondary"
                              : "destructive"
                          }
                          className="capitalize"
                        >
                          {risk.status}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={risk.value} className={getRiskColor(risk.status)} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sector Exposure */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Exposure</CardTitle>
                <CardDescription>Portfolio concentration by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px]">
                  <BarChart data={sectorExposure} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="sector" type="category" className="text-xs" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="exposure"
                      fill="hsl(var(--chart-1))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Trading Volume */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trading Volume</CardTitle>
                <CardDescription>Buy vs Sell orders ($M)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px]">
                  <BarChart data={tradingVolume}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="buy" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sell" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Trading Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Avg. Trade Size</p>
                    <p className="text-xl font-bold">$12.5M</p>
                    <div className="flex items-center gap-1 text-success text-xs mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +5.2%
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Execution Rate</p>
                    <p className="text-xl font-bold">94.8%</p>
                    <div className="flex items-center gap-1 text-success text-xs mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +1.2%
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Bid-Ask Spread</p>
                    <p className="text-xl font-bold">0.25%</p>
                    <div className="flex items-center gap-1 text-destructive text-xs mt-1">
                      <TrendingDown className="w-3 h-3" />
                      -0.02%
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Total Volume</p>
                    <p className="text-xl font-bold">$850M</p>
                    <div className="flex items-center gap-1 text-success text-xs mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +18.3%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="esg" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* ESG Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>ESG Score Trends</CardTitle>
                <CardDescription>Quarterly breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px]">
                  <LineChart data={esgTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" domain={[60, 90]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="environmental"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="social"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-2))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="governance"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-3))" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* ESG Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Current ESG Scores</CardTitle>
                <CardDescription>Latest quarterly assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Environmental</span>
                    <span className="text-sm font-bold text-chart-1">82/100</span>
                  </div>
                  <Progress value={82} className="bg-chart-1/20 [&>div]:bg-chart-1" />
                  <p className="text-xs text-muted-foreground">
                    Carbon footprint reduction initiatives on track
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Social</span>
                    <span className="text-sm font-bold text-chart-2">76/100</span>
                  </div>
                  <Progress value={76} className="bg-chart-2/20 [&>div]:bg-chart-2" />
                  <p className="text-xs text-muted-foreground">
                    Community investment programs expanding
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Governance</span>
                    <span className="text-sm font-bold text-chart-3">83/100</span>
                  </div>
                  <Progress value={83} className="bg-chart-3/20 [&>div]:bg-chart-3" />
                  <p className="text-xs text-muted-foreground">
                    Board diversity targets exceeded
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
