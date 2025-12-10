import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LoanFormData } from "../LoanOnboardingWizard";

interface WizardStep3DocumentsProps {
  formData: LoanFormData;
  updateFormData: (data: Partial<LoanFormData>) => void;
}

const documentTypes = [
  "Credit Agreement",
  "Term Sheet",
  "Financial Statements",
  "Legal Opinion",
  "Security Agreement",
  "Guarantee Agreement",
  "KYC Documentation",
  "Board Resolution",
];

export function WizardStep3Documents({ formData, updateFormData }: WizardStep3DocumentsProps) {
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("");

  const handleAddDocument = () => {
    if (newDocName && newDocType) {
      updateFormData({
        documents: [...formData.documents, { name: newDocName, type: newDocType }]
      });
      setNewDocName("");
      setNewDocType("");
    }
  };

  const handleRemoveDocument = (index: number) => {
    updateFormData({
      documents: formData.documents.filter((_, i) => i !== index)
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newDocs = files.map(file => ({
      name: file.name,
      type: "Other",
      file,
    }));
    updateFormData({ documents: [...formData.documents, ...newDocs] });
  }, [formData.documents, updateFormData]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Required Documents</h3>
        <p className="text-sm text-muted-foreground">Upload or specify the documents required for this facility.</p>
      </div>

      {/* Drop Zone */}
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors",
          "hover:border-primary/50 hover:bg-muted/30"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-foreground font-medium">Drop files here or click to upload</p>
        <p className="text-sm text-muted-foreground mt-1">PDF, DOCX, XLSX up to 50MB</p>
      </div>

      {/* Add Document Manually */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="docName" className="sr-only">Document Name</Label>
          <Input
            id="docName"
            value={newDocName}
            onChange={(e) => setNewDocName(e.target.value)}
            placeholder="Document name"
          />
        </div>
        <div className="w-48">
          <Label htmlFor="docType" className="sr-only">Document Type</Label>
          <Select value={newDocType} onValueChange={setNewDocType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleAddDocument} disabled={!newDocName || !newDocType}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Document List */}
      {formData.documents.length > 0 && (
        <div className="space-y-2">
          <Label>Added Documents</Label>
          <div className="space-y-2">
            {formData.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="iconSm" onClick={() => handleRemoveDocument(index)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
