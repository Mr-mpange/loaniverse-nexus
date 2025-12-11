import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { logAuditEvent } from "@/hooks/useAuditLog";
import {
  Settings,
  Webhook,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Activity,
  Wifi,
  WifiOff,
  Clock,
  Zap,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "banking" | "erp" | "storage";
  logo: string;
  connected: boolean;
  lastSync?: string;
  webhookUrl?: string;
  apiKey?: string;
  health: "healthy" | "degraded" | "offline" | "unknown";
  syncInterval?: number;
  autoSync?: boolean;
  syncProgress?: number;
  isSyncing?: boolean;
}

const initialIntegrations: Integration[] = [
  {
    id: "finastra",
    name: "Finastra",
    description: "Core banking integration for loan origination and servicing",
    category: "banking",
    logo: "🏦",
    connected: false,
    health: "unknown",
  },
  {
    id: "temenos",
    name: "Temenos",
    description: "Universal banking platform for end-to-end loan management",
    category: "banking",
    logo: "🏛️",
    connected: false,
    health: "unknown",
  },
  {
    id: "sap",
    name: "SAP",
    description: "Enterprise resource planning for financial operations",
    category: "erp",
    logo: "📊",
    connected: false,
    health: "unknown",
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    description: "Document management and collaboration platform",
    category: "storage",
    logo: "📁",
    connected: false,
    health: "unknown",
  },
  {
    id: "box",
    name: "Box",
    description: "Cloud content management and file sharing",
    category: "storage",
    logo: "📦",
    connected: false,
    health: "unknown",
  },
];

export function APIIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [configForm, setConfigForm] = useState({
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
    environment: "sandbox" as "sandbox" | "production",
    autoSync: true,
    syncInterval: 30,
  });

  // Health monitoring - check connected integrations every 30 seconds
  useEffect(() => {
    const checkHealth = () => {
      setIntegrations((prev) =>
        prev.map((int) => {
          if (!int.connected) return int;
          // Simulate health check with random status (mostly healthy)
          const rand = Math.random();
          const health: Integration["health"] =
            rand > 0.9 ? "degraded" : rand > 0.95 ? "offline" : "healthy";
          return { ...int, health };
        })
      );
    };

    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-sync for connected integrations
  useEffect(() => {
    const syncIntervals: NodeJS.Timeout[] = [];

    integrations.forEach((int) => {
      if (int.connected && int.autoSync && int.syncInterval) {
        const interval = setInterval(() => {
          handleAutoSync(int.id);
        }, int.syncInterval * 1000);
        syncIntervals.push(interval);
      }
    });

    return () => {
      syncIntervals.forEach(clearInterval);
    };
  }, [integrations]);

  const handleAutoSync = useCallback(async (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId ? { ...int, isSyncing: true, syncProgress: 0 } : int
      )
    );

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === integrationId ? { ...int, syncProgress: i } : int
        )
      );
    }

    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId
          ? {
              ...int,
              isSyncing: false,
              syncProgress: 100,
              lastSync: new Date().toISOString(),
            }
          : int
      )
    );
  }, []);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigForm({
      apiKey: integration.apiKey || "",
      apiSecret: "",
      webhookUrl: `https://api.lmanexus.com/webhooks/${integration.id}`,
      environment: "sandbox",
      autoSync: integration.autoSync ?? true,
      syncInterval: integration.syncInterval || 30,
    });
  };

  const handleSaveConnection = async () => {
    if (!selectedIntegration) return;

    if (!configForm.apiKey) {
      toast.error("API Key is required");
      return;
    }

    const updatedIntegration = {
      ...selectedIntegration,
      connected: true,
      lastSync: new Date().toISOString(),
      webhookUrl: configForm.webhookUrl,
      apiKey: configForm.apiKey,
      health: "healthy" as const,
      autoSync: configForm.autoSync,
      syncInterval: configForm.syncInterval,
    };

    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === selectedIntegration.id ? updatedIntegration : int
      )
    );

    // Log audit event
    await logAuditEvent({
      action: "connect",
      entity_type: "integration",
      entity_id: selectedIntegration.id,
      details: {
        name: selectedIntegration.name,
        environment: configForm.environment,
        autoSync: configForm.autoSync,
      },
    });

    toast.success(`Successfully connected to ${selectedIntegration.name}`);
    setSelectedIntegration(null);
  };

  const handleDisconnect = async (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === integrationId
          ? {
              ...int,
              connected: false,
              lastSync: undefined,
              webhookUrl: undefined,
              apiKey: undefined,
              health: "unknown",
              autoSync: false,
            }
          : int
      )
    );

    await logAuditEvent({
      action: "disconnect",
      entity_type: "integration",
      entity_id: integrationId,
      details: { name: integration?.name },
    });

    toast.success("Integration disconnected");
  };

  const handleManualSync = async (integration: Integration) => {
    await logAuditEvent({
      action: "sync",
      entity_type: "integration",
      entity_id: integration.id,
      details: { name: integration.name, type: "manual" },
    });

    toast.promise(handleAutoSync(integration.id), {
      loading: `Syncing ${integration.name}...`,
      success: `${integration.name} synced successfully`,
      error: "Sync failed",
    });
  };

  const handleTestConnection = async (integration: Integration) => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const success = Math.random() > 0.1;
          if (success) {
            setIntegrations((prev) =>
              prev.map((int) =>
                int.id === integration.id ? { ...int, health: "healthy" } : int
              )
            );
            resolve();
          } else {
            setIntegrations((prev) =>
              prev.map((int) =>
                int.id === integration.id ? { ...int, health: "degraded" } : int
              )
            );
            reject(new Error("Connection degraded"));
          }
        }, 2000);
      }),
      {
        loading: `Testing connection to ${integration.name}...`,
        success: `Connection to ${integration.name} is healthy`,
        error: `Connection to ${integration.name} is degraded`,
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getHealthIcon = (health: Integration["health"]) => {
    switch (health) {
      case "healthy":
        return <Wifi className="w-4 h-4 text-success" />;
      case "degraded":
        return <Activity className="w-4 h-4 text-warning" />;
      case "offline":
        return <WifiOff className="w-4 h-4 text-destructive" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getHealthBadge = (health: Integration["health"]) => {
    const variants = {
      healthy: "bg-success/20 text-success",
      degraded: "bg-warning/20 text-warning",
      offline: "bg-destructive/20 text-destructive",
      unknown: "bg-muted text-muted-foreground",
    };
    return (
      <Badge className={variants[health]}>
        {getHealthIcon(health)}
        <span className="ml-1 capitalize">{health}</span>
      </Badge>
    );
  };

  const renderIntegrationCard = (integration: Integration) => (
    <Card key={integration.id} className="relative overflow-hidden">
      {integration.isSyncing && (
        <div className="absolute top-0 left-0 right-0">
          <Progress value={integration.syncProgress} className="h-1 rounded-none" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
              {integration.logo}
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {integration.connected ? (
                  <>
                    <Badge variant="default" className="bg-success/20 text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                    {getHealthBadge(integration.health)}
                  </>
                ) : (
                  <Badge variant="secondary">
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">{integration.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {integration.connected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last synced
              </span>
              <span>
                {integration.lastSync
                  ? new Date(integration.lastSync).toLocaleString()
                  : "Never"}
              </span>
            </div>
            {integration.autoSync && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Auto-sync
                </span>
                <span>Every {integration.syncInterval}s</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleManualSync(integration)}
                disabled={integration.isSyncing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${integration.isSyncing ? "animate-spin" : ""}`}
                />
                Sync
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleTestConnection(integration)}
              >
                <Activity className="w-4 h-4 mr-1" />
                Test
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleConnect(integration)}
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDisconnect(integration.id)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button className="w-full" onClick={() => handleConnect(integration)}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const bankingIntegrations = integrations.filter((i) => i.category === "banking");
  const erpIntegrations = integrations.filter((i) => i.category === "erp");
  const storageIntegrations = integrations.filter((i) => i.category === "storage");
  const connectedCount = integrations.filter((i) => i.connected).length;
  const healthyCount = integrations.filter((i) => i.health === "healthy").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold">{connectedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy</p>
                <p className="text-2xl font-bold">{healthyCount}</p>
              </div>
              <Wifi className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
              <Settings className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Webhooks</p>
                <p className="text-2xl font-bold">
                  {integrations.filter((i) => i.webhookUrl).length}
                </p>
              </div>
              <Webhook className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Categories */}
      <Tabs defaultValue="banking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banking">
            Core Banking ({bankingIntegrations.length})
          </TabsTrigger>
          <TabsTrigger value="erp">ERP Systems ({erpIntegrations.length})</TabsTrigger>
          <TabsTrigger value="storage">
            Document Storage ({storageIntegrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankingIntegrations.map(renderIntegrationCard)}
          </div>
        </TabsContent>

        <TabsContent value="erp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {erpIntegrations.map(renderIntegrationCard)}
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storageIntegrations.map(renderIntegrationCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                  {selectedIntegration.logo}
                </div>
                <div>
                  <CardTitle>Configure {selectedIntegration.name}</CardTitle>
                  <CardDescription>
                    Set up API credentials and sync settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Environment</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="environment"
                      checked={configForm.environment === "sandbox"}
                      onChange={() =>
                        setConfigForm((prev) => ({ ...prev, environment: "sandbox" }))
                      }
                      className="text-primary"
                    />
                    <span className="text-sm">Sandbox</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="environment"
                      checked={configForm.environment === "production"}
                      onChange={() =>
                        setConfigForm((prev) => ({ ...prev, environment: "production" }))
                      }
                      className="text-primary"
                    />
                    <span className="text-sm">Production</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key *</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    placeholder="Enter your API key"
                    value={configForm.apiKey}
                    onChange={(e) =>
                      setConfigForm((prev) => ({ ...prev, apiKey: e.target.value }))
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="Enter your API secret (optional)"
                  value={configForm.apiSecret}
                  onChange={(e) =>
                    setConfigForm((prev) => ({ ...prev, apiSecret: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookUrl"
                    value={configForm.webhookUrl}
                    onChange={(e) =>
                      setConfigForm((prev) => ({ ...prev, webhookUrl: e.target.value }))
                    }
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(configForm.webhookUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure this URL in your {selectedIntegration.name} dashboard to
                  receive events
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoSync" className="text-sm font-medium">
                      Enable auto-sync
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically sync data at regular intervals
                    </p>
                  </div>
                  <Switch
                    id="autoSync"
                    checked={configForm.autoSync}
                    onCheckedChange={(checked) =>
                      setConfigForm((prev) => ({ ...prev, autoSync: checked }))
                    }
                  />
                </div>

                {configForm.autoSync && (
                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Sync Interval (seconds)</Label>
                    <Input
                      id="syncInterval"
                      type="number"
                      min="10"
                      max="3600"
                      value={configForm.syncInterval}
                      onChange={(e) =>
                        setConfigForm((prev) => ({
                          ...prev,
                          syncInterval: parseInt(e.target.value) || 30,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedIntegration(null)}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveConnection}>
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
