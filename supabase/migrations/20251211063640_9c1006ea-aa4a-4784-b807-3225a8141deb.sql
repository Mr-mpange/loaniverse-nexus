-- Create audit_logs table for tracking all integration events and data changes
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view logs
CREATE POLICY "Authenticated users can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (true);

-- Allow authenticated users to create logs
CREATE POLICY "Authenticated users can create audit logs" 
ON public.audit_logs 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs (entity_type);
CREATE INDEX idx_audit_logs_action ON public.audit_logs (action);