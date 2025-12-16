import {
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TradingWidget } from "@/components/dashboard/TradingWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const marketData = [
  { name: "Acme Corp", bid: 99.25, ask: 99.50, change: +0.15 },
  { name: "TechFlow Inc", bid: 98.00, ask: 98.25, change: -0.25 },
  { name: "Global Industries", bid: 97.50, ask: 97.75, change: +0.50 },
  { name: "Meridian Holdings", bid: 96.75, ask: 97.00, change: -0.10 },
];

const recentTrades = [
  { id: 1, borrower: "Acme Corp", side: "BUY", amount: "$5M", price: 99.25, time: "2 min ago" },
  { id: 2, borrower: "TechFlow Inc", side: "SELL", amount: "$10M", price: 98.50, time: "15 min ago" },
  { id: 3, borrower: "Global Industries", side: "BUY", amount: "$2.5M", price: 97.75, time: "1 hr ago" },
];

export function TraderDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Trader focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Volume"
          value="$125M"
          change="+18.5%"
          changeType="positive"
          icon={DollarSign}
          iconColor="primary"
          subtitle="vs yesterday"
        />
        <MetricCard
          title="Active Orders"
          value="7"
          change="3 bids, 4 asks"
          changeType="neutral"
          icon={ArrowRightLeft}
          iconColor="warning"
        />
        <MetricCard
          title="Executed Today"
          value="12"
          change="$45M total"
          changeType="positive"
          icon={TrendingUp}
          iconColor="success"
        />
        <MetricCard
          title="Avg Spread"
          value="0.25%"
          change="-0.05%"
          changeType="positive"
          icon={Activity}
          iconColor="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Overview */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Market Overview
              <Badge variant="outline" className="ml-auto text-xs bg-green-500/10 text-green-500 border-green-500/30">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-4 text-xs text-muted-foreground pb-2 border-b border-border">
                <span>Borrower</span>
                <span className="text-right">Bid</span>
                <span className="text-right">Ask</span>
                <span className="text-right">Change</span>
              </div>
              {marketData.map((item, i) => (
                <div key={i} className="grid grid-cols-4 text-sm py-2 hover:bg-muted/30 rounded px-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-right text-green-500">{item.bid.toFixed(2)}</span>
                  <span className="text-right text-red-500">{item.ask.toFixed(2)}</span>
                  <span className={`text-right flex items-center justify-end gap-1 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">Open Trading Board</Button>
          </CardContent>
        </Card>

        <TradingWidget />
      </div>

      {/* Recent Trades */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Recent Trades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-6 text-xs text-muted-foreground pb-2 border-b border-border">
              <span>Borrower</span>
              <span>Side</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Price</span>
              <span className="text-right">Time</span>
              <span></span>
            </div>
            {recentTrades.map((trade) => (
              <div key={trade.id} className="grid grid-cols-6 text-sm py-2 items-center hover:bg-muted/30 rounded px-1">
                <span className="font-medium">{trade.borrower}</span>
                <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'} className="w-fit text-xs">
                  {trade.side}
                </Badge>
                <span className="text-right">{trade.amount}</span>
                <span className="text-right">{trade.price}</span>
                <span className="text-right text-muted-foreground">{trade.time}</span>
                <Button variant="ghost" size="sm" className="ml-auto">View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
