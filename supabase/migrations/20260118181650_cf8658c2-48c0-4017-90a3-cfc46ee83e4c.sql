-- Create loans table
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_name TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'review', 'closed', 'defaulted')),
  stage TEXT NOT NULL DEFAULT 'onboarding' CHECK (stage IN ('onboarding', 'documentation', 'review', 'approval', 'closing', 'active', 'monitoring')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  interest_rate DECIMAL(5, 2),
  maturity_date DATE,
  assigned_officer_id UUID REFERENCES auth.users(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
  file_path TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trades table
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE SET NULL,
  borrower_name TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  amount DECIMAL(15, 2) NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'executed', 'cancelled', 'settled')),
  trader_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Loans policies: admins and loan officers can manage, traders can view
CREATE POLICY "Admins can manage all loans"
ON public.loans FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Loan officers can view all loans"
ON public.loans FOR SELECT
USING (public.has_role(auth.uid(), 'loan_officer'));

CREATE POLICY "Loan officers can create loans"
ON public.loans FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'loan_officer'));

CREATE POLICY "Loan officers can update assigned loans"
ON public.loans FOR UPDATE
USING (public.has_role(auth.uid(), 'loan_officer') AND (assigned_officer_id = auth.uid() OR created_by = auth.uid()));

CREATE POLICY "Traders can view active loans"
ON public.loans FOR SELECT
USING (public.has_role(auth.uid(), 'trader') AND status = 'active');

CREATE POLICY "Compliance officers can view all loans"
ON public.loans FOR SELECT
USING (public.has_role(auth.uid(), 'compliance_officer'));

-- Documents policies
CREATE POLICY "Admins can manage all documents"
ON public.documents FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Loan officers can manage documents"
ON public.documents FOR ALL
USING (public.has_role(auth.uid(), 'loan_officer'))
WITH CHECK (public.has_role(auth.uid(), 'loan_officer'));

CREATE POLICY "Compliance officers can view documents"
ON public.documents FOR SELECT
USING (public.has_role(auth.uid(), 'compliance_officer'));

-- Trades policies
CREATE POLICY "Admins can manage all trades"
ON public.trades FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Traders can manage own trades"
ON public.trades FOR ALL
USING (public.has_role(auth.uid(), 'trader'))
WITH CHECK (public.has_role(auth.uid(), 'trader'));

CREATE POLICY "Loan officers can view trades"
ON public.trades FOR SELECT
USING (public.has_role(auth.uid(), 'loan_officer'));

CREATE POLICY "Compliance officers can view trades"
ON public.trades FOR SELECT
USING (public.has_role(auth.uid(), 'compliance_officer'));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.loans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;

-- Create updated_at triggers
CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();