import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "../TradingBoard";

interface OrderConfirmationDialogProps {
  order: Order | null;
  onConfirm: (order: Order, quantity: string) => void;
  onCancel: () => void;
}

export function OrderConfirmationDialog({ order, onConfirm, onCancel }: OrderConfirmationDialogProps) {
  const [quantity, setQuantity] = useState(order?.amount || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm(order, quantity);
    setIsSubmitting(false);
    setQuantity("");
  };

  const isBid = order.side === "bid";
  const actionLabel = isBid ? "Lift" : "Hit";
  const actionColor = isBid ? "text-success" : "text-destructive";

  return (
    <Dialog open={!!order} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBid ? <ArrowUpRight className="w-5 h-5 text-success" /> : <ArrowDownRight className="w-5 h-5 text-destructive" />}
            <span>Confirm {actionLabel} Order</span>
          </DialogTitle>
          <DialogDescription>
            Review the order details before {isBid ? "lifting" : "hitting"} this {order.side}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="glass-card p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Borrower</span>
              <span className="font-medium text-foreground">{order.borrower}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Facility</span>
              <span className="text-foreground">{order.facility}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dealer</span>
              <span className="text-foreground">{order.dealer}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Amount</span>
                <span className="font-mono font-semibold text-foreground">{order.amount}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Price</span>
                <span className={cn("font-mono font-semibold", actionColor)}>{order.price}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted-foreground">Spread</span>
                <span className="font-mono text-foreground">{order.spread}bps</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Order Quantity</Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={order.amount}
            />
            <p className="text-xs text-muted-foreground">Enter the amount you wish to {isBid ? "lift" : "hit"}. Leave blank to take full amount.</p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
            <p className="text-sm text-warning">
              This action will submit a binding order. Please verify all details before confirming.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button variant={isBid ? "success" : "destructive"} onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>Confirm {actionLabel}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
