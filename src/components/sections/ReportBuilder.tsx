import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { logAuditEvent } from "@/hooks/useAuditLog";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  Leaf,
  Eye,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";

interface ReportSection {
  id: string;
  name: string;
  type: "chart" | "table" | "metric" | "text";
  enabled: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: ReportSection[];
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "portfolio",
    name: "Portfolio Performance",
    description: "Comprehensive portfolio analysis with performance metrics",
    icon: TrendingUp,
    sections: [
      { id: "summary", name: "Executive Summary", type: "text", enabled: true },
      { id: "performance", name: "Performance Chart", type: "chart", enabled: true },
      { id: "allocation", name: "Asset Allocation", type: "chart", enabled: true },
      { id: "holdings", name: "Holdings Table", type: "table", enabled: true },
      { id: "returns", name: "Returns Analysis", type: "metric", enabled: true },
    ],
  },
  {
    id: "risk",
    name: "Risk Assessment",
    description: "Risk metrics, exposure analysis, and stress testing",
    icon: BarChart3,
    sections: [
      { id: "risk-summary", name: "Risk Summary", type: "text", enabled: true },
      { id: "risk-metrics", name: "Risk Metrics", type: "metric", enabled: true },
      { id: "exposure", name: "Sector Exposure", type: "chart", enabled: true },
      { id: "concentration", name: "Concentration Risk", type: "table", enabled: true },
      { id: "var", name: "Value at Risk", type: "chart", enabled: true },
    ],
  },
  {
    id: "compliance",
    name: "Compliance Report",
    description: "Regulatory compliance status and audit trail",
    icon: Shield,
    sections: [
      { id: "status", name: "Compliance Status", type: "metric", enabled: true },
      { id: "issues", name: "Open Issues", type: "table", enabled: true },
      { id: "audit", name: "Audit Trail", type: "table", enabled: true },
      { id: "remediation", name: "Remediation Progress", type: "chart", enabled: true },
    ],
  },
  {
    id: "esg",
    name: "ESG Report",
    description: "Environmental, Social, and Governance performance",
    icon: Leaf,
    sections: [
      { id: "esg-scores", name: "ESG Scores", type: "metric", enabled: true },
      { id: "environmental", name: "Environmental Metrics", type: "chart", enabled: true },
      { id: "social", name: "Social Impact", type: "chart", enabled: true },
      { id: "governance", name: "Governance Practices", type: "table", enabled: true },
    ],
  },
];

interface CustomComponent {
  id: string;
  name: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
}

const availableComponents: CustomComponent[] = [
  { id: "portfolio-metrics", name: "Portfolio Metrics", type: "Metrics", icon: TrendingUp },
  { id: "performance-chart", name: "Performance Chart", type: "Chart", icon: BarChart3 },
  { id: "allocation-pie", name: "Asset Allocation", type: "Pie Chart", icon: PieChart },
  { id: "holdings-table", name: "Holdings Table", type: "Table", icon: FileText },
  { id: "risk-metrics", name: "Risk Metrics", type: "Metrics", icon: Shield },
  { id: "esg-scores", name: "ESG Scores", type: "Metrics", icon: Leaf },
  { id: "compliance-status", name: "Compliance Status", type: "Table", icon: Shield },
  { id: "sector-exposure", name: "Sector Exposure", type: "Chart", icon: BarChart3 },
];

export function ReportBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportName, setReportName] = useState("");
  const [dateRange, setDateRange] = useState("last-30-days");
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [generating, setGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Custom report builder state
  const [customReportStarted, setCustomReportStarted] = useState(false);
  const [customComponents, setCustomComponents] = useState<CustomComponent[]>([]);
  const [customReportName, setCustomReportName] = useState("My Custom Report");
  const [customDateRange, setCustomDateRange] = useState("last-30-days");
  
  // Scheduled reports state
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, name: "Weekly Portfolio Summary", schedule: "Every Monday 9:00 AM", status: "active" },
    { id: 2, name: "Monthly Compliance Report", schedule: "1st of month 8:00 AM", status: "active" },
    { id: 3, name: "Quarterly ESG Report", schedule: "End of quarter", status: "paused" },
  ]);

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setReportName(`${template.name} - ${new Date().toLocaleDateString()}`);
    setSections([...template.sections]);
  };

  const toggleSection = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleExport = async (format: "pdf" | "excel") => {
    if (!selectedTemplate) return;

    setGenerating(true);
    
    // Log the export event
    await logAuditEvent({
      action: "export",
      entity_type: "report",
      entity_id: selectedTemplate.id,
      details: {
        format,
        reportName,
        dateRange,
        sections: sections.filter((s) => s.enabled).map((s) => s.name),
      },
    });

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate CSV data for Excel export
    if (format === "excel") {
      const csvContent = generateExcelData();
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // For PDF, we'd normally use a library like jsPDF
      // For demo, we'll create a simple text file
      const pdfContent = generatePdfContent();
      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportName.replace(/\s+/g, "_")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setGenerating(false);
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const generateExcelData = () => {
    const enabledSections = sections.filter((s) => s.enabled);
    let csv = `Report: ${reportName}\nDate Range: ${dateRange}\nGenerated: ${new Date().toLocaleString()}\n\n`;

    enabledSections.forEach((section) => {
      csv += `\n--- ${section.name} ---\n`;
      if (section.type === "metric") {
        csv += "Metric,Value,Change\n";
        csv += "Portfolio Value,$4.68B,+12.4%\n";
        csv += "Risk Score,56/100,Moderate\n";
        csv += "ESG Score,78/100,+8 pts\n";
      } else if (section.type === "table") {
        csv += "Item,Status,Value\n";
        csv += "Term Loans,Active,$2.1B\n";
        csv += "Revolving Credit,Active,$1.2B\n";
        csv += "Bridge Loans,Active,$0.7B\n";
      }
    });

    return csv;
  };

  const generatePdfContent = () => {
    const enabledSections = sections.filter((s) => s.enabled);
    let content = `
═══════════════════════════════════════════════════════════════
                    ${reportName.toUpperCase()}
═══════════════════════════════════════════════════════════════

Date Range: ${dateRange}
Generated: ${new Date().toLocaleString()}
Template: ${selectedTemplate?.name}

`;

    enabledSections.forEach((section) => {
      content += `\n▸ ${section.name}\n${"─".repeat(50)}\n`;
      if (section.type === "metric") {
        content += `  • Portfolio Value: $4.68B (+12.4% YTD)\n`;
        content += `  • Risk Score: 56/100 (Moderate)\n`;
        content += `  • ESG Score: 78/100 (+8 pts QoQ)\n`;
        content += `  • Compliance Rate: 98.5%\n`;
      } else if (section.type === "text") {
        content += `  This report provides a comprehensive overview of portfolio\n`;
        content += `  performance and key metrics for the selected period.\n`;
      } else if (section.type === "table") {
        content += `  ┌─────────────────────┬──────────┬─────────────┐\n`;
        content += `  │ Category            │ Status   │ Value       │\n`;
        content += `  ├─────────────────────┼──────────┼─────────────┤\n`;
        content += `  │ Term Loans          │ Active   │ $2.1B       │\n`;
        content += `  │ Revolving Credit    │ Active   │ $1.2B       │\n`;
        content += `  │ Bridge Loans        │ Active   │ $0.7B       │\n`;
        content += `  └─────────────────────┴──────────┴─────────────┘\n`;
      } else if (section.type === "chart") {
        content += `  [Chart visualization would appear here]\n`;
        content += `  Data points: Q1: 72, Q2: 75, Q3: 78, Q4: 82\n`;
      }
    });

    content += `\n═══════════════════════════════════════════════════════════════\n`;
    content += `                    END OF REPORT\n`;
    content += `═══════════════════════════════════════════════════════════════\n`;

    return content;
  };

  // Custom report builder functions
  const addCustomComponent = (component: CustomComponent) => {
    setCustomComponents((prev) => [...prev, component]);
    toast.success(`Added ${component.name} to report`);
  };

  const removeCustomComponent = (index: number) => {
    setCustomComponents((prev) => prev.filter((_, i) => i !== index));
    toast.success("Component removed from report");
  };

  const handleCustomExport = async (format: "pdf" | "excel") => {
    if (customComponents.length === 0) {
      toast.error("Please add at least one component to your report");
      return;
    }

    setGenerating(true);
    
    // Log the export event
    await logAuditEvent({
      action: "export",
      entity_type: "custom_report",
      entity_id: "custom",
      details: {
        format,
        reportName: customReportName,
        dateRange: customDateRange,
        components: customComponents.map((c) => c.name),
      },
    });

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (format === "excel") {
      const csvContent = generateCustomExcelData();
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customReportName.replace(/\s+/g, "_")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const pdfContent = generateCustomPdfContent();
      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customReportName.replace(/\s+/g, "_")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setGenerating(false);
    toast.success(`Custom report exported as ${format.toUpperCase()}`);
  };

  const generateCustomExcelData = () => {
    let csv = `Report: ${customReportName}\nDate Range: ${customDateRange}\nGenerated: ${new Date().toLocaleString()}\n\n`;

    customComponents.forEach((component) => {
      csv += `\n--- ${component.name} ---\n`;
      if (component.type === "Metrics") {
        csv += "Metric,Value,Change\n";
        csv += "Portfolio Value,$4.68B,+12.4%\n";
        csv += "Risk Score,56/100,Moderate\n";
        csv += "ESG Score,78/100,+8 pts\n";
      } else if (component.type === "Table") {
        csv += "Item,Status,Value\n";
        csv += "Term Loans,Active,$2.1B\n";
        csv += "Revolving Credit,Active,$1.2B\n";
        csv += "Bridge Loans,Active,$0.7B\n";
      } else if (component.type === "Chart" || component.type === "Pie Chart") {
        csv += "Category,Value\n";
        csv += "Equities,45%\n";
        csv += "Fixed Income,35%\n";
        csv += "Alternatives,20%\n";
      }
    });

    return csv;
  };

  const generateCustomPdfContent = () => {
    let content = `
═══════════════════════════════════════════════════════════════
                    ${customReportName.toUpperCase()}
═══════════════════════════════════════════════════════════════

Date Range: ${customDateRange}
Generated: ${new Date().toLocaleString()}
Type: Custom Report

`;

    customComponents.forEach((component) => {
      content += `\n▸ ${component.name}\n${"─".repeat(50)}\n`;
      if (component.type === "Metrics") {
        content += `  • Portfolio Value: $4.68B (+12.4% YTD)\n`;
        content += `  • Risk Score: 56/100 (Moderate)\n`;
        content += `  • ESG Score: 78/100 (+8 pts QoQ)\n`;
        content += `  • Compliance Rate: 98.5%\n`;
      } else if (component.type === "Table") {
        content += `  ┌─────────────────────┬──────────┬─────────────┐\n`;
        content += `  │ Category            │ Status   │ Value       │\n`;
        content += `  ├─────────────────────┼──────────┼─────────────┤\n`;
        content += `  │ Term Loans          │ Active   │ $2.1B       │\n`;
        content += `  │ Revolving Credit    │ Active   │ $1.2B       │\n`;
        content += `  │ Bridge Loans        │ Active   │ $0.7B       │\n`;
        content += `  └─────────────────────┴──────────┴─────────────┘\n`;
      } else if (component.type === "Chart" || component.type === "Pie Chart") {
        content += `  [${component.type} visualization would appear here]\n`;
        content += `  Data: Equities 45%, Fixed Income 35%, Alternatives 20%\n`;
      }
    });

    content += `\n═══════════════════════════════════════════════════════════════\n`;
    content += `                    END OF REPORT\n`;
    content += `═══════════════════════════════════════════════════════════════\n`;

    return content;
  };

  // Scheduled reports functions
  const deleteScheduledReport = (reportId: number) => {
    setScheduledReports((prev) => prev.filter((report) => report.id !== reportId));
    toast.success("Scheduled report deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          {!selectedTemplate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {template.sections.map((section) => (
                          <Badge key={section.id} variant="secondary" className="text-xs">
                            {section.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                        ← Back
                      </Button>
                      <div>
                        <CardTitle>{selectedTemplate.name}</CardTitle>
                        <CardDescription>Configure your report</CardDescription>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                      <Eye className="w-4 h-4 mr-1" />
                      {previewMode ? "Edit" : "Preview"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportName">Report Name</Label>
                      <Input
                        id="reportName"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger>
                          <Calendar className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                          <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                          <SelectItem value="last-quarter">Last Quarter</SelectItem>
                          <SelectItem value="last-year">Last Year</SelectItem>
                          <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Report Sections</Label>
                    <div className="space-y-2">
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <Checkbox
                            checked={section.enabled}
                            onCheckedChange={() => toggleSection(section.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{section.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {section.type}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {section.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Options</CardTitle>
                  <CardDescription>Download your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={() => handleExport("pdf")}
                    disabled={generating}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {generating ? "Generating..." : "Export as PDF"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleExport("excel")}
                    disabled={generating}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    {generating ? "Generating..." : "Export as Excel"}
                  </Button>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Report Summary</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Template</span>
                        <span>{selectedTemplate.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sections</span>
                        <span>{sections.filter((s) => s.enabled).length} included</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date Range</span>
                        <span className="capitalize">{dateRange.replace(/-/g, " ")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          {!customReportStarted ? (
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>
                  Build a custom report by selecting data sources and visualizations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Drag and drop components to build your custom report
                  </p>
                  <Button className="mt-4" onClick={() => setCustomReportStarted(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Component Library */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Components</CardTitle>
                  <CardDescription>Drag to add to your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {availableComponents.map((component) => {
                    const Icon = component.icon;
                    return (
                      <div
                        key={component.id}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => addCustomComponent(component)}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{component.name}</p>
                          <p className="text-xs text-muted-foreground">{component.type}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Report Canvas */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Report Canvas</CardTitle>
                      <CardDescription>Build your custom report here</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCustomReportStarted(false)}>
                      ← Back
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 min-h-[400px] border-2 border-dashed border-muted-foreground/20 rounded-lg p-4">
                    {customComponents.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">
                            Add components from the library to start building your report
                          </p>
                        </div>
                      </div>
                    ) : (
                      customComponents.map((component, index) => {
                        const Icon = component.icon;
                        return (
                          <div
                            key={`${component.id}-${index}`}
                            className="flex items-center justify-between p-4 rounded-lg border bg-card"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">{component.name}</p>
                                <p className="text-sm text-muted-foreground">{component.type}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomComponent(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Settings & Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>Configure your report</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customReportName">Report Name</Label>
                    <Input
                      id="customReportName"
                      value={customReportName}
                      onChange={(e) => setCustomReportName(e.target.value)}
                      placeholder="My Custom Report"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select value={customDateRange} onValueChange={setCustomDateRange}>
                      <SelectTrigger>
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 Days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="ytd">Year to Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => handleCustomExport("pdf")}
                      disabled={customComponents.length === 0 || generating}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleCustomExport("excel")}
                      disabled={customComponents.length === 0 || generating}
                    >
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Report Summary</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Components</span>
                        <span>{customComponents.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date Range</span>
                        <span className="capitalize">{customDateRange.replace(/-/g, " ")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Set up automated report generation and delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.schedule}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === "active" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteScheduledReport(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
