import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePendingTrades } from "@/hooks/useTrades";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function TradingWidget() {
  const { data: trades = [], isLoading } = usePendingTrades();

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-5 glow-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Live Trading Board</h3>
            <p className="text-xs text-muted-foreground">Real-time bid/ask activity</p>
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 glow-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Live Trading Board</h3>
          <p className="text-xs text-muted-foreground">Real-time bid/ask activity</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="status-indicator bg-success" />
          <span className="text-xs text-success font-medium">LIVE</span>
        </div>
      </div>

      {trades.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No pending trades</p>
          <p className="text-xs mt-1">Create a trade to see it here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trades.slice(0, 5).map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    trade.side === "BUY" ? "bg-success/10" : "bg-destructive/10"
                  )}
                >
                  {trade.side === "BUY" ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{trade.borrower_name}</p>
                  <p className="text-xs text-muted-foreground">{formatAmount(trade.amount)}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "font-mono text-sm font-semibold",
                    trade.side === "BUY" ? "text-success" : "text-destructive"
                  )}
                >
                  {trade.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">
                    {formatDistanceToNow(new Date(trade.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View Full Trading Board →
      </button>
    </div>
  );
}
