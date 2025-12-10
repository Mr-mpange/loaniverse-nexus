import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, FileText, Copy, Download, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface AIDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DocumentType = "credit_agreement" | "term_sheet" | "amendment";

const documentTemplates = {
  credit_agreement: {
    title: "Credit Agreement",
    description: "Generate a comprehensive LMA-compliant credit agreement",
    fields: ["borrower", "amount", "currency", "tenor", "purpose", "rate"],
  },
  term_sheet: {
    title: "Term Sheet",
    description: "Create a concise term sheet outlining key commercial terms",
    fields: ["borrower", "facility", "amount", "tenor", "pricing", "security"],
  },
  amendment: {
    title: "Amendment Letter",
    description: "Draft an amendment to modify existing loan documentation",
    fields: ["originalAgreement", "amendmentType", "changes", "effectiveDate"],
  },
};

export function AIDocumentDialog({ open, onOpenChange }: AIDocumentDialogProps) {
  const [documentType, setDocumentType] = useState<DocumentType>("credit_agreement");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setActiveTab("preview");

    try {
      const { data, error } = await supabase.functions.invoke("generate-document", {
        body: { type: documentType, context: formData },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      toast({ title: "Document Generated!", description: "AI has created your document." });
    } catch (error: any) {
      console.error("Error generating document:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({ title: "Copied!", description: "Document copied to clipboard." });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderFormFields = () => {
    const template = documentTemplates[documentType];
    
    switch (documentType) {
      case "credit_agreement":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Borrower Name *</Label>
              <Input value={formData.borrower || ""} onChange={(e) => updateField("borrower", e.target.value)} placeholder="Acme Corporation" />
            </div>
            <div className="space-y-2">
              <Label>Facility Amount *</Label>
              <Input value={formData.amount || ""} onChange={(e) => updateField("amount", e.target.value)} placeholder="$100,000,000" />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency || "USD"} onValueChange={(v) => updateField("currency", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tenor</Label>
              <Input value={formData.tenor || ""} onChange={(e) => updateField("tenor", e.target.value)} placeholder="5 years" />
            </div>
            <div className="space-y-2">
              <Label>Interest Rate</Label>
              <Input value={formData.rate || ""} onChange={(e) => updateField("rate", e.target.value)} placeholder="SOFR + 175bps" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Purpose</Label>
              <Textarea value={formData.purpose || ""} onChange={(e) => updateField("purpose", e.target.value)} placeholder="General corporate purposes, acquisition financing..." rows={2} />
            </div>
          </div>
        );
      case "term_sheet":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Borrower Name *</Label>
              <Input value={formData.borrower || ""} onChange={(e) => updateField("borrower", e.target.value)} placeholder="Tech Holdings Inc." />
            </div>
            <div className="space-y-2">
              <Label>Facility Type</Label>
              <Input value={formData.facility || ""} onChange={(e) => updateField("facility", e.target.value)} placeholder="Term Loan B" />
            </div>
            <div className="space-y-2">
              <Label>Amount *</Label>
              <Input value={formData.amount || ""} onChange={(e) => updateField("amount", e.target.value)} placeholder="$75,000,000" />
            </div>
            <div className="space-y-2">
              <Label>Tenor</Label>
              <Input value={formData.tenor || ""} onChange={(e) => updateField("tenor", e.target.value)} placeholder="7 years" />
            </div>
            <div className="space-y-2">
              <Label>Pricing</Label>
              <Input value={formData.pricing || ""} onChange={(e) => updateField("pricing", e.target.value)} placeholder="SOFR + 200bps" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Security Package</Label>
              <Textarea value={formData.security || ""} onChange={(e) => updateField("security", e.target.value)} placeholder="First lien on all assets..." rows={2} />
            </div>
          </div>
        );
      case "amendment":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Original Agreement *</Label>
              <Input value={formData.originalAgreement || ""} onChange={(e) => updateField("originalAgreement", e.target.value)} placeholder="Credit Agreement dated January 15, 2024" />
            </div>
            <div className="space-y-2">
              <Label>Amendment Type</Label>
              <Select value={formData.amendmentType || ""} onValueChange={(v) => updateField("amendmentType", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="covenant_waiver">Covenant Waiver</SelectItem>
                  <SelectItem value="pricing_change">Pricing Change</SelectItem>
                  <SelectItem value="maturity_extension">Maturity Extension</SelectItem>
                  <SelectItem value="commitment_increase">Commitment Increase</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Changes Description *</Label>
              <Textarea value={formData.changes || ""} onChange={(e) => updateField("changes", e.target.value)} placeholder="Describe the modifications to be made..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Effective Date</Label>
              <Input type="date" value={formData.effectiveDate || ""} onChange={(e) => updateField("effectiveDate", e.target.value)} />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Document Generator
          </DialogTitle>
          <DialogDescription>
            Select a template and provide details to generate LMA-compliant documentation.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "form" | "preview")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Document Setup</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedContent && !isGenerating}>
              Preview {isGenerating && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6 mt-4">
            {/* Template Selection */}
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(documentTemplates) as DocumentType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setDocumentType(type)}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    documentType === type
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className={cn("w-4 h-4", documentType === type ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-medium text-foreground">{documentTemplates[type].title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{documentTemplates[type].description}</p>
                </button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="glass-card p-4">
              {renderFormFields()}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleGenerate} disabled={isGenerating} variant="glow">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Document
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">AI is generating your document...</p>
                <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">{documentTemplates[documentType].title}</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleGenerate}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[400px] rounded-lg border border-border">
                  <div className="p-4 prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">{generatedContent}</pre>
                  </div>
                </ScrollArea>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
