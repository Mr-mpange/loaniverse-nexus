import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  name: string;
  type: string;
  loan_id: string | null;
  file_path: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Document[];
    },
  });
}

export function useDocumentStats() {
  return useQuery({
    queryKey: ["document-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id, status");
      
      if (error) throw error;
      
      const docs = data || [];
      return {
        total: docs.length,
        pending: docs.filter(d => d.status === 'pending').length,
        approved: docs.filter(d => d.status === 'approved').length,
        draft: docs.filter(d => d.status === 'draft').length,
      };
    },
  });
}

export function useRecentDocuments(limit = 5) {
  return useQuery({
    queryKey: ["recent-documents", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as Document[];
    },
  });
}
