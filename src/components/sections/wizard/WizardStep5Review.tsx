import { Building2, DollarSign, FileText, Scale, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoanFormData } from "../LoanOnboardingWizard";

interface WizardStep5ReviewProps {
  formData: LoanFormData;
}

export function WizardStep5Review({ formData }: WizardStep5ReviewProps) {
  const facilityTypeLabels: Record<string, string> = {
    term_loan: "Term Loan",
    revolver: "Revolving Credit",
    term_loan_a: "Term Loan A",
    term_loan_b: "Term Loan B",
    bridge_loan: "Bridge Loan",
    delayed_draw: "Delayed Draw",
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: formData.currency, maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Review & Submit</h3>
        <p className="text-sm text-muted-foreground">Please review all details before creating the loan facility.</p>
      </div>

      {/* Borrower Summary */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Building2 className="w-5 h-5" />
          <h4 className="font-semibold">Borrower Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <span className="ml-2 text-foreground font-medium">{formData.borrowerName || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Type:</span>
            <span className="ml-2 text-foreground capitalize">{formData.borrowerType.replace(/_/g, " ")}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Industry:</span>
            <span className="ml-2 text-foreground capitalize">{formData.industry.replace(/_/g, " ") || "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Rating:</span>
            <span className="ml-2 text-foreground">{formData.creditRating || "—"}</span>
          </div>
        </div>
      </div>

      {/* Facility Summary */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <DollarSign className="w-5 h-5" />
          <h4 className="font-semibold">Facility Details</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Type:</span>
            <span className="ml-2 text-foreground">{facilityTypeLabels[formData.facilityType] || formData.facilityType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Amount:</span>
            <span className="ml-2 text-foreground font-mono font-semibold">{formatAmount(formData.facilityAmount)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tenor:</span>
            <span className="ml-2 text-foreground">{formData.tenor} months</span>
          </div>
          <div>
            <span className="text-muted-foreground">Rate:</span>
            <span className="ml-2 text-foreground">{formData.interestRate} + {formData.margin}bps</span>
          </div>
        </div>
        {formData.purpose && (
          <div className="pt-2 border-t border-border">
            <span className="text-muted-foreground text-sm">Purpose:</span>
            <p className="text-foreground text-sm mt-1">{formData.purpose}</p>
          </div>
        )}
      </div>

      {/* Documents Summary */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <FileText className="w-5 h-5" />
          <h4 className="font-semibold">Documents ({formData.documents.length})</h4>
        </div>
        {formData.documents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.documents.map((doc, i) => (
              <span key={i} className="px-2 py-1 bg-muted text-foreground text-xs rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-success" />
                {doc.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No documents added</p>
        )}
      </div>

      {/* Covenants Summary */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Scale className="w-5 h-5" />
          <h4 className="font-semibold">Covenants ({formData.covenants.length})</h4>
        </div>
        {formData.covenants.length > 0 ? (
          <div className="space-y-2">
            {formData.covenants.map((cov, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-foreground capitalize">{cov.type.replace(/_/g, " ")}</span>
                <span className="font-mono text-muted-foreground">{cov.threshold} ({cov.frequency})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No covenants defined</p>
        )}
      </div>
    </div>
  );
}
