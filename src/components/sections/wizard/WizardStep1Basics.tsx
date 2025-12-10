import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LoanFormData } from "../LoanOnboardingWizard";

interface WizardStep1BasicsProps {
  formData: LoanFormData;
  updateFormData: (data: Partial<LoanFormData>) => void;
}

const industries = ["Technology", "Healthcare", "Energy", "Manufacturing", "Financial Services", "Retail", "Real Estate", "Telecommunications"];
const countries = ["United States", "United Kingdom", "Germany", "France", "Canada", "Australia", "Japan", "Singapore"];
const ratings = ["AAA", "AA+", "AA", "AA-", "A+", "A", "A-", "BBB+", "BBB", "BBB-", "BB+", "BB", "BB-", "B+", "B", "B-"];

export function WizardStep1Basics({ formData, updateFormData }: WizardStep1BasicsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Borrower Information</h3>
        <p className="text-sm text-muted-foreground">Enter the basic details about the borrower entity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="borrowerName">Borrower Name *</Label>
          <Input
            id="borrowerName"
            value={formData.borrowerName}
            onChange={(e) => updateFormData({ borrowerName: e.target.value })}
            placeholder="e.g., Acme Corporation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="borrowerType">Borrower Type</Label>
          <Select value={formData.borrowerType} onValueChange={(v) => updateFormData({ borrowerType: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="financial_sponsor">Financial Sponsor</SelectItem>
              <SelectItem value="sovereign">Sovereign</SelectItem>
              <SelectItem value="project_finance">Project Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry *</Label>
          <Select value={formData.industry} onValueChange={(v) => updateFormData({ industry: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(ind => (
                <SelectItem key={ind} value={ind.toLowerCase().replace(/\s/g, '_')}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country of Incorporation *</Label>
          <Select value={formData.country} onValueChange={(v) => updateFormData({ country: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map(c => (
                <SelectItem key={c} value={c.toLowerCase().replace(/\s/g, '_')}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditRating">Credit Rating</Label>
          <Select value={formData.creditRating} onValueChange={(v) => updateFormData({ creditRating: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {ratings.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
