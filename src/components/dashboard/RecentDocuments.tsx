import { FileText, Clock, Download, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  type: "credit_agreement" | "term_sheet" | "amendment" | "facility";
  status: "draft" | "review" | "signed";
  borrower: string;
  lastModified: string;
}

const documents: Document[] = [
  {
    id: "1",
    name: "Credit Agreement - Acme Corp",
    type: "credit_agreement",
    status: "review",
    borrower: "Acme Corp",
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    name: "Term Sheet - Tech Holdings",
    type: "term_sheet",
    status: "draft",
    borrower: "Tech Holdings",
    lastModified: "5 hours ago",
  },
  {
    id: "3",
    name: "Amendment #3 - Global Industries",
    type: "amendment",
    status: "signed",
    borrower: "Global Industries",
    lastModified: "1 day ago",
  },
  {
    id: "4",
    name: "Facility Agreement - Finance Ltd",
    type: "facility",
    status: "review",
    borrower: "Finance Ltd",
    lastModified: "2 days ago",
  },
];

const typeLabels: Record<Document["type"], string> = {
  credit_agreement: "Credit Agreement",
  term_sheet: "Term Sheet",
  amendment: "Amendment",
  facility: "Facility Agreement",
};

export function RecentDocuments() {
  return (
    <div className="glass-card p-5 glow-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent Documents</h3>
          <p className="text-xs text-muted-foreground">Auto-generated loan documents</p>
        </div>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          New Document
        </Button>
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{doc.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{typeLabels[doc.type]}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{doc.lastModified}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-1 rounded capitalize",
                  doc.status === "draft" && "bg-muted text-muted-foreground",
                  doc.status === "review" && "bg-warning/10 text-warning",
                  doc.status === "signed" && "bg-success/10 text-success"
                )}
              >
                {doc.status}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="iconSm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="iconSm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="iconSm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View All Documents →
      </button>
    </div>
  );
}
