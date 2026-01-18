import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Loan {
  id: string;
  borrower_name: string;
  amount: number;
  currency: string;
  status: string;
  stage: string;
  progress: number;
  interest_rate: number | null;
  maturity_date: string | null;
  assigned_officer_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useLoans() {
  return useQuery({
    queryKey: ["loans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Loan[];
    },
  });
}

export function useLoanStats() {
  return useQuery({
    queryKey: ["loan-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loans")
        .select("id, amount, status, stage");
      
      if (error) throw error;
      
      const loans = data || [];
      const totalVolume = loans.reduce((sum, loan) => sum + Number(loan.amount), 0);
      const activeLoans = loans.filter(l => l.status === 'active').length;
      const pendingLoans = loans.filter(l => l.status === 'pending' || l.status === 'review').length;
      const pipelineValue = loans
        .filter(l => l.status === 'pending' || l.status === 'review')
        .reduce((sum, loan) => sum + Number(loan.amount), 0);
      
      return {
        totalVolume,
        activeLoans,
        pendingLoans,
        pipelineValue,
        totalCount: loans.length,
      };
    },
  });
}

export function useMyAssignedLoans(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-loans", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("loans")
        .select("*")
        .or(`assigned_officer_id.eq.${userId},created_by.eq.${userId}`)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Loan[];
    },
    enabled: !!userId,
  });
}
