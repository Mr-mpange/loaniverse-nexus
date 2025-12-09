import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Filter, RefreshCw, TrendingUp, BarChart3, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  borrower: string;
  facility: string;
  amount: string;
  price: string;
  spread: string;
  side: "bid" | "ask";
  dealer: string;
  time: string;
  rating: string;
}

const orders: Order[] = [
  { id: "1", borrower: "Acme Corp", facility: "Term Loan B", amount: "$50M", price: "99.75", spread: "+175", side: "bid", dealer: "JP Morgan", time: "10:32:15", rating: "BBB+" },
  { id: "2", borrower: "Tech Holdings", facility: "Revolver", amount: "$25M", price: "100.25", spread: "+150", side: "ask", dealer: "Goldman Sachs", time: "10:31:42", rating: "A-" },
  { id: "3", borrower: "Global Industries", facility: "Term Loan A", amount: "$75M", price: "98.50", spread: "+200", side: "bid", dealer: "Citi", time: "10:30:18", rating: "BB+" },
  { id: "4", borrower: "Finance Ltd", facility: "Term Loan B", amount: "$30M", price: "101.00", spread: "+125", side: "ask", dealer: "Bank of America", time: "10:29:55", rating: "BBB" },
  { id: "5", borrower: "Energy Partners", facility: "Term Loan C", amount: "$100M", price: "97.25", spread: "+225", side: "bid", dealer: "Morgan Stanley", time: "10:28:30", rating: "BB" },
  { id: "6", borrower: "Healthcare Inc", facility: "Revolver", amount: "$40M", price: "99.50", spread: "+180", side: "ask", dealer: "Wells Fargo", time: "10:27:12", rating: "BBB-" },
  { id: "7", borrower: "Retail Group", facility: "Term Loan B", amount: "$60M", price: "96.75", spread: "+250", side: "bid", dealer: "Credit Suisse", time: "10:25:45", rating: "B+" },
  { id: "8", borrower: "Manufacturing Co", facility: "Term Loan A", amount: "$45M", price: "100.50", spread: "+140", side: "ask", dealer: "Deutsche Bank", time: "10:24:20", rating: "A" },
];

const marketStats = [
  { label: "Total Volume", value: "$2.4B", change: "+8.2%" },
  { label: "Avg Spread", value: "+178bps", change: "-5bps" },
  { label: "Bid/Ask Ratio", value: "1.2x", change: "+0.1" },
  { label: "Active Dealers", value: "42", change: "+3" },
];

export function TradingBoard() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Market Stats */}
      <div className="grid grid-cols-4 gap-4">
        {marketStats.map((stat) => (
          <div key={stat.label} className="glass-card p-4 glow-border">
            <p className="section-header mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-mono font-bold text-foreground">{stat.value}</p>
              <span className="text-xs text-success font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Trading Board */}
      <div className="glass-card glow-border overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-foreground">Live Order Book</h2>
            <div className="flex items-center gap-1.5">
              <span className="status-indicator bg-success" />
              <span className="text-xs text-success font-medium">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input placeholder="Search borrower..." className="w-48 h-9" />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Side</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Borrower</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Facility</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Spread</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dealer</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={cn(
                    "hover:bg-muted/30 transition-colors cursor-pointer",
                    selectedOrder === order.id && "bg-primary/5"
                  )}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <td className="px-4 py-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center",
                        order.side === "bid" ? "bg-success/10" : "bg-destructive/10"
                      )}
                    >
                      {order.side === "bid" ? (
                        <ArrowUpRight className="w-4 h-4 text-success" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">{order.borrower}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{order.facility}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-muted text-foreground">
                      {order.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{order.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        order.side === "bid" ? "text-success" : "text-destructive"
                      )}
                    >
                      {order.price}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">{order.spread}bps</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{order.dealer}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono text-xs">{order.time}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button size="sm" variant={order.side === "bid" ? "success" : "destructive"}>
                      <Zap className="w-3 h-3 mr-1" />
                      {order.side === "bid" ? "Lift" : "Hit"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">8</span> of{" "}
            <span className="font-medium text-foreground">156</span> orders
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
