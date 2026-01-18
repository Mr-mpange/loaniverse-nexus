import { FileText, Clock, Download, Eye, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRecentDocuments } from "@/hooks/useDocuments";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const typeLabels: Record<string, string> = {
  credit_agreement: "Credit Agreement",
  term_sheet: "Term Sheet",
  amendment: "Amendment",
  facility: "Facility Agreement",
  other: "Document",
};

export function RecentDocuments() {
  const { data: documents = [], isLoading } = useRecentDocuments(5);

  if (isLoading) {
    return (
      <div className="glass-card p-5 glow-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Recent Documents</h3>
            <p className="text-xs text-muted-foreground">Auto-generated loan documents</p>
          </div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

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

      {documents.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No documents yet</p>
          <p className="text-xs mt-1">Create your first document to get started</p>
        </div>
      ) : (
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
                    <span>{typeLabels[doc.type] || doc.type}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-1 rounded capitalize",
                    doc.status === "draft" && "bg-muted text-muted-foreground",
                    doc.status === "pending" && "bg-warning/10 text-warning",
                    doc.status === "approved" && "bg-success/10 text-success",
                    doc.status === "rejected" && "bg-destructive/10 text-destructive"
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
      )}

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
        View All Documents →
      </button>
    </div>
  );
}
