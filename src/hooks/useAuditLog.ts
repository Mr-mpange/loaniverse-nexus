import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface AuditLogEntry {
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
}

export async function logAuditEvent(entry: AuditLogEntry) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action: entry.action,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id || null,
    details: entry.details as Json || null,
  });

  if (error) {
    console.error("Failed to log audit event:", error);
  }
}

export function useAuditLog() {
  return { logAuditEvent };
}
