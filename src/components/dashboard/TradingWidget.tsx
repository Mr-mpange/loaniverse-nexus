import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Trade {
  id: string;
  borrower: string;
  amount: string;
  price: string;
  side: "bid" | "ask";
  time: string;
}

const trades: Trade[] = [
  { id: "1", borrower: "Acme Corp", amount: "$50M", price: "99.75", side: "bid", time: "2m ago" },
  { id: "2", borrower: "Tech Holdings", amount: "$25M", price: "100.25", side: "ask", time: "5m ago" },
  { id: "3", borrower: "Global Industries", amount: "$75M", price: "98.50", side: "bid", time: "8m ago" },
  { id: "4", borrower: "Finance Ltd", amount: "$30M", price: "101.00", side: "ask", time: "12m ago" },
  { id: "5", borrower: "Energy Partners", amount: "$100M", price: "97.25", side: "bid", time: "15m ago" },
];

export function TradingWidget() {
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

      <div className="space-y-2">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center",
                  trade.side === "bid" ? "bg-success/10" : "bg-destructive/10"
                )}
              >
                {trade.side === "bid" ? (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{trade.borrower}</p>
                <p className="text-xs text-muted-foreground">{trade.amount}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "font-mono text-sm font-semibold",
                  trade.side === "bid" ? "text-success" : "text-destructive"
                )}
              >
                {trade.price}
              </p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="text-[10px]">{trade.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View Full Trading Board →
      </button>
    </div>
  );
}
