import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Trade {
  id: string;
  loan_id: string | null;
  borrower_name: string;
  side: "BUY" | "SELL";
  amount: number;
  price: number;
  status: string;
  trader_id: string;
  created_at: string;
  updated_at: string;
}

export function useTrades() {
  return useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Trade[];
    },
  });
}

export function useTradeStats() {
  return useQuery({
    queryKey: ["trade-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("id, amount, status, side");
      
      if (error) throw error;
      
      const trades = data || [];
      const pendingTrades = trades.filter(t => t.status === 'pending');
      const pendingValue = pendingTrades.reduce((sum, t) => sum + Number(t.amount), 0);
      const executedTrades = trades.filter(t => t.status === 'executed');
      const executedValue = executedTrades.reduce((sum, t) => sum + Number(t.amount), 0);
      
      return {
        pendingCount: pendingTrades.length,
        pendingValue,
        executedCount: executedTrades.length,
        executedValue,
        totalCount: trades.length,
        buyCount: trades.filter(t => t.side === 'BUY').length,
        sellCount: trades.filter(t => t.side === 'SELL').length,
      };
    },
  });
}

export function useMyTrades(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-trades", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("trader_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!userId,
  });
}

export function usePendingTrades() {
  return useQuery({
    queryKey: ["pending-trades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as Trade[];
    },
  });
}
