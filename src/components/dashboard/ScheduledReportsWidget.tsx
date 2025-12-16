import { Calendar, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ScheduledReport {
  id: string;
  report_name: string;
  template_id: string;
  frequency: string;
  next_run_at: string | null;
  is_active: boolean;
}

const templateNames: Record<string, string> = {
  portfolio: "Portfolio Performance",
  risk: "Risk Metrics",
  compliance: "Compliance Report",
  esg: "ESG Analysis",
};

export function ScheduledReportsWidget() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["scheduled-reports-widget"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_reports")
        .select("*")
        .eq("is_active", true)
        .order("next_run_at", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data as ScheduledReport[];
    },
  });

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Scheduled Reports
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {reports?.length || 0} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reports && reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{report.report_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {templateNames[report.template_id] || report.template_id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {report.next_run_at
                    ? format(new Date(report.next_run_at), "MMM d, h:mm a")
                    : "Not scheduled"}
                </div>
                <Badge variant="secondary" className="text-[10px] mt-1">
                  {report.frequency}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No scheduled reports</p>
            <p className="text-xs">Set up automated reports in Settings</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
