import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Trash2, Plus } from "lucide-react";
import type { LoanFormData } from "../LoanOnboardingWizard";

interface WizardStep4CovenantsProps {
  formData: LoanFormData;
  updateFormData: (data: Partial<LoanFormData>) => void;
}

const covenantTypes = [
  { value: "leverage", label: "Leverage Ratio", metric: "Debt/EBITDA" },
  { value: "interest_coverage", label: "Interest Coverage", metric: "EBITDA/Interest" },
  { value: "fixed_charge", label: "Fixed Charge Coverage", metric: "EBITDA/Fixed Charges" },
  { value: "current_ratio", label: "Current Ratio", metric: "Current Assets/Liabilities" },
  { value: "debt_service", label: "Debt Service Coverage", metric: "Cash Flow/Debt Service" },
  { value: "capex", label: "Capital Expenditure", metric: "Annual CapEx" },
];

const frequencies = ["Quarterly", "Semi-Annually", "Annually"];

export function WizardStep4Covenants({ formData, updateFormData }: WizardStep4CovenantsProps) {
  const [newCovenant, setNewCovenant] = useState({ type: "", metric: "", threshold: "", frequency: "Quarterly" });

  const handleAddCovenant = () => {
    if (newCovenant.type && newCovenant.threshold) {
      const covenantInfo = covenantTypes.find(c => c.value === newCovenant.type);
      updateFormData({
        covenants: [...formData.covenants, {
          ...newCovenant,
          metric: covenantInfo?.metric || newCovenant.type,
        }]
      });
      setNewCovenant({ type: "", metric: "", threshold: "", frequency: "Quarterly" });
    }
  };

  const handleRemoveCovenant = (index: number) => {
    updateFormData({
      covenants: formData.covenants.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Financial Covenants</h3>
        <p className="text-sm text-muted-foreground">Define the financial covenants for this facility.</p>
      </div>

      {/* Add Covenant Form */}
      <div className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="space-y-2">
            <Label>Covenant Type</Label>
            <Select value={newCovenant.type} onValueChange={(v) => setNewCovenant(prev => ({ ...prev, type: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {covenantTypes.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Threshold</Label>
            <Input
              value={newCovenant.threshold}
              onChange={(e) => setNewCovenant(prev => ({ ...prev, threshold: e.target.value }))}
              placeholder="e.g., ≤ 4.0x"
            />
          </div>
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={newCovenant.frequency} onValueChange={(v) => setNewCovenant(prev => ({ ...prev, frequency: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map(f => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddCovenant} disabled={!newCovenant.type || !newCovenant.threshold}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Covenant List */}
      {formData.covenants.length > 0 ? (
        <div className="space-y-2">
          {formData.covenants.map((cov, index) => {
            const covenantInfo = covenantTypes.find(c => c.value === cov.type);
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <Scale className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{covenantInfo?.label || cov.type}</p>
                    <p className="text-sm text-muted-foreground">{cov.metric}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-mono font-semibold text-foreground">{cov.threshold}</p>
                    <p className="text-xs text-muted-foreground">{cov.frequency}</p>
                  </div>
                  <Button variant="ghost" size="iconSm" onClick={() => handleRemoveCovenant(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Scale className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>No covenants added yet</p>
          <p className="text-sm">Add financial covenants to monitor borrower compliance</p>
        </div>
      )}
    </div>
  );
}
