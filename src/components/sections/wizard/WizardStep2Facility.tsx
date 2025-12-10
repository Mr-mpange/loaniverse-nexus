import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LoanFormData } from "../LoanOnboardingWizard";

interface WizardStep2FacilityProps {
  formData: LoanFormData;
  updateFormData: (data: Partial<LoanFormData>) => void;
}

export function WizardStep2Facility({ formData, updateFormData }: WizardStep2FacilityProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Facility Details</h3>
        <p className="text-sm text-muted-foreground">Define the loan facility structure and terms.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facilityType">Facility Type *</Label>
          <Select value={formData.facilityType} onValueChange={(v) => updateFormData({ facilityType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="term_loan">Term Loan</SelectItem>
              <SelectItem value="revolver">Revolving Credit</SelectItem>
              <SelectItem value="term_loan_a">Term Loan A</SelectItem>
              <SelectItem value="term_loan_b">Term Loan B</SelectItem>
              <SelectItem value="bridge_loan">Bridge Loan</SelectItem>
              <SelectItem value="delayed_draw">Delayed Draw</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <Select value={formData.currency} onValueChange={(v) => updateFormData({ currency: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD - US Dollar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
              <SelectItem value="GBP">GBP - British Pound</SelectItem>
              <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
              <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facilityAmount">Facility Amount *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="facilityAmount"
              value={formData.facilityAmount}
              onChange={(e) => updateFormData({ facilityAmount: e.target.value })}
              placeholder="100,000,000"
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenor">Tenor (months) *</Label>
          <Input
            id="tenor"
            type="number"
            value={formData.tenor}
            onChange={(e) => updateFormData({ tenor: e.target.value })}
            placeholder="60"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">Reference Rate</Label>
          <Select value={formData.interestRate} onValueChange={(v) => updateFormData({ interestRate: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SOFR">SOFR</SelectItem>
              <SelectItem value="EURIBOR">EURIBOR</SelectItem>
              <SelectItem value="SONIA">SONIA</SelectItem>
              <SelectItem value="TONAR">TONAR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin">Margin (bps) *</Label>
          <Input
            id="margin"
            type="number"
            value={formData.margin}
            onChange={(e) => updateFormData({ margin: e.target.value })}
            placeholder="175"
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="purpose">Purpose of Facility</Label>
          <Textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => updateFormData({ purpose: e.target.value })}
            placeholder="General corporate purposes, refinancing of existing debt, acquisition financing..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
