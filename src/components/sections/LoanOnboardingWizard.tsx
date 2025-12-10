import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Building2, FileText, Scale, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { WizardStep1Basics } from "./wizard/WizardStep1Basics";
import { WizardStep2Facility } from "./wizard/WizardStep2Facility";
import { WizardStep3Documents } from "./wizard/WizardStep3Documents";
import { WizardStep4Covenants } from "./wizard/WizardStep4Covenants";
import { WizardStep5Review } from "./wizard/WizardStep5Review";
import { useToast } from "@/hooks/use-toast";

export interface LoanFormData {
  // Step 1: Basics
  borrowerName: string;
  borrowerType: string;
  industry: string;
  country: string;
  creditRating: string;
  // Step 2: Facility
  facilityType: string;
  facilityAmount: string;
  currency: string;
  tenor: string;
  purpose: string;
  interestRate: string;
  margin: string;
  // Step 3: Documents
  documents: Array<{ name: string; type: string; file?: File }>;
  // Step 4: Covenants
  covenants: Array<{ type: string; metric: string; threshold: string; frequency: string }>;
  // Step 5: Syndicate
  leadArranger: string;
  syndicate: Array<{ name: string; commitment: string }>;
}

const initialFormData: LoanFormData = {
  borrowerName: "",
  borrowerType: "corporate",
  industry: "",
  country: "",
  creditRating: "",
  facilityType: "term_loan",
  facilityAmount: "",
  currency: "USD",
  tenor: "",
  purpose: "",
  interestRate: "SOFR",
  margin: "",
  documents: [],
  covenants: [],
  leadArranger: "",
  syndicate: [],
};

const steps = [
  { id: 1, title: "Borrower Info", icon: Building2 },
  { id: 2, title: "Facility Details", icon: DollarSign },
  { id: 3, title: "Documents", icon: FileText },
  { id: 4, title: "Covenants", icon: Scale },
  { id: 5, title: "Review & Submit", icon: Users },
];

interface LoanOnboardingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanOnboardingWizard({ open, onOpenChange }: LoanOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LoanFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const progress = (currentStep / steps.length) * 100;

  const updateFormData = (data: Partial<LoanFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast({
      title: "Loan Facility Created!",
      description: `${formData.facilityType} for ${formData.borrowerName} has been successfully onboarded.`,
    });
    onOpenChange(false);
    setCurrentStep(1);
    setFormData(initialFormData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WizardStep1Basics formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <WizardStep2Facility formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <WizardStep3Documents formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <WizardStep4Covenants formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <WizardStep5Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Loan Facility Onboarding</DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          
          {/* Steps indicator */}
          <div className="flex justify-between">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      isCompleted ? "bg-success text-success-foreground" :
                      isCurrent ? "bg-primary text-primary-foreground" :
                      "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px] py-4">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} variant="glow">
              {isSubmitting ? "Creating..." : "Create Loan Facility"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
