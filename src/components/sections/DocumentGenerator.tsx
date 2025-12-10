import { useState } from "react";
import {
  FileText, Plus, Search, Filter, Download, Eye, Edit, Copy, MoreVertical,
  CheckCircle, Clock, AlertTriangle, Sparkles, Scale, FileCheck, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AIDocumentDialog } from "./documents/AIDocumentDialog";

interface Clause {
  id: string;
  name: string;
  category: string;
  riskScore: number;
  version: string;
  lastUsed: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  borrower: string;
  status: "draft" | "review" | "approved" | "signed";
  clauses: number;
  riskScore: number;
  lastModified: string;
  author: string;
}

const documents: Document[] = [
  { id: "1", name: "Credit Agreement - Acme Corp", type: "Credit Agreement", borrower: "Acme Corp", status: "review", clauses: 45, riskScore: 72, lastModified: "2 hours ago", author: "John A." },
  { id: "2", name: "Term Sheet - Tech Holdings", type: "Term Sheet", borrower: "Tech Holdings", status: "draft", clauses: 18, riskScore: 85, lastModified: "5 hours ago", author: "Sarah M." },
  { id: "3", name: "Facility Agreement - Global Industries", type: "Facility Agreement", borrower: "Global Industries", status: "signed", clauses: 52, riskScore: 68, lastModified: "1 day ago", author: "Mike R." },
  { id: "4", name: "Amendment #3 - Finance Ltd", type: "Amendment", borrower: "Finance Ltd", status: "approved", clauses: 12, riskScore: 91, lastModified: "2 days ago", author: "Lisa K." },
];

const clauseLibrary: Clause[] = [
  { id: "1", name: "Financial Covenant - Debt/EBITDA", category: "Covenants", riskScore: 75, version: "3.2", lastUsed: "Today" },
  { id: "2", name: "MAC Clause (Standard)", category: "Conditions", riskScore: 82, version: "2.1", lastUsed: "Yesterday" },
  { id: "3", name: "Cross-Default Provision", category: "Events of Default", riskScore: 68, version: "4.0", lastUsed: "3 days ago" },
  { id: "4", name: "ESG Margin Ratchet", category: "Pricing", riskScore: 90, version: "1.5", lastUsed: "1 week ago" },
  { id: "5", name: "Sustainability-Linked KPIs", category: "ESG", riskScore: 88, version: "2.0", lastUsed: "2 days ago" },
];

const statusConfig = {
  draft: { icon: Edit, color: "text-muted-foreground", bg: "bg-muted" },
  review: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  approved: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  signed: { icon: FileCheck, color: "text-success", bg: "bg-success/10" },
};

export function DocumentGenerator() {
  const [activeTab, setActiveTab] = useState<"documents" | "clauses">("documents");
  const [aiDialogOpen, setAIDialogOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={activeTab === "documents" ? "default" : "outline"} onClick={() => setActiveTab("documents")}>
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </Button>
          <Button variant={activeTab === "clauses" ? "default" : "outline"} onClick={() => setActiveTab("clauses")}>
            <Scale className="w-4 h-4 mr-2" />
            Clause Library
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="glow" onClick={() => setAIDialogOpen(true)}>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-card p-4 glow-border flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents or clauses..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {activeTab === "documents" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {documents.map((doc) => {
            const StatusIcon = statusConfig[doc.status].icon;
            return (
              <div key={doc.id} className="glass-card p-5 glow-border hover:bg-card/90 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">{doc.type}</p>
                    </div>
                  </div>
                  <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium", statusConfig[doc.status].bg, statusConfig[doc.status].color)}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="capitalize">{doc.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="section-header mb-1">Clauses</p>
                    <p className="font-mono font-semibold text-foreground">{doc.clauses}</p>
                  </div>
                  <div>
                    <p className="section-header mb-1">Risk Score</p>
                    <div className="flex items-center gap-2">
                      <span className={cn("font-mono font-semibold", doc.riskScore >= 80 ? "text-success" : doc.riskScore >= 60 ? "text-warning" : "text-destructive")}>{doc.riskScore}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", doc.riskScore >= 80 ? "bg-success" : doc.riskScore >= 60 ? "bg-warning" : "bg-destructive")} style={{ width: `${doc.riskScore}%` }} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="section-header mb-1">Modified</p>
                    <p className="text-sm text-muted-foreground">{doc.lastModified}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">By {doc.author} • {doc.borrower}</p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="iconSm"><Eye className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="iconSm"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="iconSm"><Download className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="iconSm"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card glow-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Clause</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Score</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Version</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Used</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clauseLibrary.map((clause) => (
                <tr key={clause.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Scale className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{clause.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">{clause.category}</span></td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("font-mono font-semibold", clause.riskScore >= 80 ? "text-success" : clause.riskScore >= 60 ? "text-warning" : "text-destructive")}>{clause.riskScore}</span>
                  </td>
                  <td className="px-4 py-4 text-center font-mono text-sm text-muted-foreground">v{clause.version}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground">{clause.lastUsed}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="iconSm"><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="iconSm"><Copy className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="iconSm"><Edit className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AIDocumentDialog open={aiDialogOpen} onOpenChange={setAIDialogOpen} />
    </div>
  );
}
