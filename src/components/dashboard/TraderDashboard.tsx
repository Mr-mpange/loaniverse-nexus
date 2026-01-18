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
import { Skeleton } from "@/components/ui/skeleton";
import { useTrades, useTradeStats } from "@/hooks/useTrades";
import { useLoans } from "@/hooks/useLoans";
import { formatDistanceToNow } from "date-fns";

export function TraderDashboard() {
  const { data: trades = [], isLoading: tradesLoading } = useTrades();
  const { data: tradeStats, isLoading: statsLoading } = useTradeStats();
  const { data: loans = [], isLoading: loansLoading } = useLoans();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  // Create market data from active loans
  const marketData = loans.slice(0, 4).map((loan, i) => ({
    name: loan.borrower_name,
    bid: 97 + Math.random() * 3,
    ask: 97.5 + Math.random() * 3,
    change: (Math.random() - 0.5) * 1,
  }));

  const recentTrades = trades.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Trader focused metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Volume"
          value={statsLoading ? "..." : formatAmount(tradeStats?.executedValue || 0)}
          change={`${tradeStats?.executedCount || 0} trades`}
          changeType="positive"
          icon={DollarSign}
          iconColor="primary"
          subtitle="executed"
        />
        <MetricCard
          title="Active Orders"
          value={statsLoading ? "..." : String(tradeStats?.pendingCount || 0)}
          change={`${tradeStats?.buyCount || 0} buys, ${tradeStats?.sellCount || 0} sells`}
          changeType="neutral"
          icon={ArrowRightLeft}
          iconColor="warning"
        />
        <MetricCard
          title="Executed Today"
          value={statsLoading ? "..." : String(tradeStats?.executedCount || 0)}
          change={formatAmount(tradeStats?.executedValue || 0) + " total"}
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
            {loansLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : marketData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No market data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-4 text-xs text-muted-foreground pb-2 border-b border-border">
                  <span>Borrower</span>
                  <span className="text-right">Bid</span>
                  <span className="text-right">Ask</span>
                  <span className="text-right">Change</span>
                </div>
                {marketData.map((item, i) => (
                  <div key={i} className="grid grid-cols-4 text-sm py-2 hover:bg-muted/30 rounded px-1">
                    <span className="font-medium truncate">{item.name}</span>
                    <span className="text-right text-green-500">{item.bid.toFixed(2)}</span>
                    <span className="text-right text-red-500">{item.ask.toFixed(2)}</span>
                    <span className={`text-right flex items-center justify-end gap-1 ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
          {tradesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentTrades.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No trades yet</p>
              <p className="text-xs mt-1">Execute your first trade to see it here</p>
            </div>
          ) : (
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
                  <span className="font-medium truncate">{trade.borrower_name}</span>
                  <Badge variant={trade.side === 'BUY' ? 'default' : 'secondary'} className="w-fit text-xs">
                    {trade.side}
                  </Badge>
                  <span className="text-right">{formatAmount(trade.amount)}</span>
                  <span className="text-right">{trade.price.toFixed(2)}</span>
                  <span className="text-right text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(trade.created_at), { addSuffix: true })}
                  </span>
                  <Button variant="ghost" size="sm" className="ml-auto">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
