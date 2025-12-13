import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { logAuditEvent } from "@/hooks/useAuditLog";
import {
  Calendar,
  Clock,
  Mail,
  Plus,
  Trash2,
  Send,
  Loader2,
  FileText,
  BarChart3,
  Shield,
  Leaf,
  Play,
  Pause,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ScheduledReport {
  id: string;
  user_id: string;
  report_name: string;
  template_id: string;
  frequency: string;
  recipients: string[];
  date_range: string;
  is_active: boolean;
  last_sent_at: string | null;
  next_run_at: string | null;
  created_at: string;
}

const templateIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  portfolio: BarChart3,
  risk: BarChart3,
  compliance: Shield,
  esg: Leaf,
};

const templateNames: Record<string, string> = {
  portfolio: "Portfolio Performance",
  risk: "Risk Assessment",
  compliance: "Compliance Report",
  esg: "ESG Report",
};

export function ScheduledReports() {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    report_name: "",
    template_id: "portfolio",
    frequency: "weekly",
    recipients: "",
    date_range: "last-7-days",
  });
  const [sendingReport, setSendingReport] = useState<string | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["scheduled-reports", user?.id],
    queryFn: async () => {
      if (!user?.id || !session?.access_token) return [];
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/scheduled_reports?user_id=eq.${user.id}&order=created_at.desc`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
      return response.json();
    },
    enabled: !!user?.id && !!session?.access_token,
  });

  const createReportMutation = useMutation({
    mutationFn: async (report: typeof newReport) => {
      if (!user?.id || !session?.access_token) throw new Error("Not authenticated");

      const recipients = report.recipients
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e);

      const now = new Date();
      let nextRun: Date;
      switch (report.frequency) {
        case "daily":
          nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          nextRun = new Date(now.setMonth(now.getMonth() + 1));
          break;
        default:
          nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/scheduled_reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session.access_token}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            user_id: user.id,
            report_name: report.report_name,
            template_id: report.template_id,
            frequency: report.frequency,
            recipients,
            date_range: report.date_range,
            next_run_at: nextRun.toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create scheduled report");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-reports", user?.id] });
      setIsDialogOpen(false);
      setNewReport({
        report_name: "",
        template_id: "portfolio",
        frequency: "weekly",
        recipients: "",
        date_range: "last-7-days",
      });
      toast.success("Scheduled report created");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create report");
    },
  });

  const toggleReportMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      if (!session?.access_token) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/scheduled_reports?id=eq.${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ is_active }),
        }
      );

      if (!response.ok) throw new Error("Failed to update report");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-reports", user?.id] });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.access_token) throw new Error("Not authenticated");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/scheduled_reports?id=eq.${id}`,
        {
          method: "DELETE",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete report");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-reports", user?.id] });
      toast.success("Report deleted");
    },
  });

  const sendReportNow = async (reportId: string) => {
    setSendingReport(reportId);
    try {
      const { error } = await supabase.functions.invoke("send-scheduled-report", {
        body: { reportId, manual: true },
      });

      if (error) throw error;

      await logAuditEvent({
        action: "send",
        entity_type: "scheduled_report",
        entity_id: reportId,
        details: { manual: true },
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports", user?.id] });
      toast.success("Report sent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to send report");
    } finally {
      setSendingReport(null);
    }
  };

  const handleCreateReport = () => {
    if (!newReport.report_name.trim()) {
      toast.error("Please enter a report name");
      return;
    }
    if (!newReport.recipients.trim()) {
      toast.error("Please enter at least one recipient email");
      return;
    }
    createReportMutation.mutate(newReport);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Reports</h2>
          <p className="text-muted-foreground">
            Automate report delivery to your inbox
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Report</DialogTitle>
              <DialogDescription>
                Configure automatic report delivery
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={newReport.report_name}
                  onChange={(e) =>
                    setNewReport({ ...newReport, report_name: e.target.value })
                  }
                  placeholder="Weekly Portfolio Summary"
                />
              </div>

              <div className="space-y-2">
                <Label>Report Template</Label>
                <Select
                  value={newReport.template_id}
                  onValueChange={(value) =>
                    setNewReport({ ...newReport, template_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portfolio">Portfolio Performance</SelectItem>
                    <SelectItem value="risk">Risk Assessment</SelectItem>
                    <SelectItem value="compliance">Compliance Report</SelectItem>
                    <SelectItem value="esg">ESG Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={newReport.frequency}
                  onValueChange={(value) =>
                    setNewReport({ ...newReport, frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select
                  value={newReport.date_range}
                  onValueChange={(value) =>
                    setNewReport({ ...newReport, date_range: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients (comma-separated)</Label>
                <Input
                  id="recipients"
                  value={newReport.recipients}
                  onChange={(e) =>
                    setNewReport({ ...newReport, recipients: e.target.value })
                  }
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCreateReport}
                disabled={createReportMutation.isPending}
              >
                {createReportMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Schedule
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Scheduled Reports</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first scheduled report to receive automated updates
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report: ScheduledReport) => {
            const Icon = templateIcons[report.template_id] || FileText;
            return (
              <Card key={report.id} className={!report.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{report.report_name}</CardTitle>
                        <CardDescription>
                          {templateNames[report.template_id]}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={report.is_active}
                        onCheckedChange={(checked) =>
                          toggleReportMutation.mutate({ id: report.id, is_active: checked })
                        }
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                      <Clock className="w-3 h-3 mr-1" />
                      {report.frequency}
                    </Badge>
                    <Badge variant="outline">
                      <Mail className="w-3 h-3 mr-1" />
                      {report.recipients.length} recipient
                      {report.recipients.length !== 1 ? "s" : ""}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {report.date_range.replace(/-/g, " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      {report.last_sent_at && (
                        <span>
                          Last sent: {new Date(report.last_sent_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div>
                      {report.next_run_at && report.is_active && (
                        <span>
                          Next: {new Date(report.next_run_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendReportNow(report.id)}
                      disabled={sendingReport === report.id}
                    >
                      {sendingReport === report.id ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-1" />
                      )}
                      Send Now
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteReportMutation.mutate(report.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
