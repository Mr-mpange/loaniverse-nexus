import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
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
}

const initialIntegrations: Integration[] = [
  {
    id: "finastra",
    name: "Finastra",
    description: "Core banking integration for loan origination and servicing",
    category: "banking",
    logo: "🏦",
    connected: false,
  },
  {
    id: "temenos",
    name: "Temenos",
    description: "Universal banking platform for end-to-end loan management",
    category: "banking",
    logo: "🏛️",
    connected: false,
  },
  {
    id: "sap",
    name: "SAP",
    description: "Enterprise resource planning for financial operations",
    category: "erp",
    logo: "📊",
    connected: false,
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    description: "Document management and collaboration platform",
    category: "storage",
    logo: "📁",
    connected: false,
  },
  {
    id: "box",
    name: "Box",
    description: "Cloud content management and file sharing",
    category: "storage",
    logo: "📦",
    connected: false,
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
  });

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConfigForm({
      apiKey: "",
      apiSecret: "",
      webhookUrl: `https://api.lmanexus.com/webhooks/${integration.id}`,
      environment: "sandbox",
    });
  };

  const handleSaveConnection = () => {
    if (!selectedIntegration) return;

    if (!configForm.apiKey) {
      toast.error("API Key is required");
      return;
    }

    setIntegrations(prev =>
      prev.map(int =>
        int.id === selectedIntegration.id
          ? {
              ...int,
              connected: true,
              lastSync: new Date().toISOString(),
              webhookUrl: configForm.webhookUrl,
              apiKey: configForm.apiKey,
            }
          : int
      )
    );

    toast.success(`Successfully connected to ${selectedIntegration.name}`);
    setSelectedIntegration(null);
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev =>
      prev.map(int =>
        int.id === integrationId
          ? { ...int, connected: false, lastSync: undefined, webhookUrl: undefined, apiKey: undefined }
          : int
      )
    );
    toast.success("Integration disconnected");
  };

  const handleTestConnection = (integration: Integration) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: `Testing connection to ${integration.name}...`,
        success: `Connection to ${integration.name} is healthy`,
        error: "Connection test failed",
      }
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const renderIntegrationCard = (integration: Integration) => (
    <Card key={integration.id} className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
              {integration.logo}
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <Badge
                variant={integration.connected ? "default" : "secondary"}
                className="mt-1"
              >
                {integration.connected ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Not Connected
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">{integration.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {integration.connected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last synced</span>
              <span>{integration.lastSync ? new Date(integration.lastSync).toLocaleString() : "Never"}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleTestConnection(integration)}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Test
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleConnect(integration)}
              >
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDisconnect(integration.id)}
              >
                Disconnect
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

  const bankingIntegrations = integrations.filter(i => i.category === "banking");
  const erpIntegrations = integrations.filter(i => i.category === "erp");
  const storageIntegrations = integrations.filter(i => i.category === "storage");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.connected).length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
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
                <p className="text-sm text-muted-foreground">Webhooks Active</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.webhookUrl).length}</p>
              </div>
              <Webhook className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Categories */}
      <Tabs defaultValue="banking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banking">Core Banking ({bankingIntegrations.length})</TabsTrigger>
          <TabsTrigger value="erp">ERP Systems ({erpIntegrations.length})</TabsTrigger>
          <TabsTrigger value="storage">Document Storage ({storageIntegrations.length})</TabsTrigger>
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
                  <CardDescription>Set up API credentials and webhook endpoints</CardDescription>
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
                      onChange={() => setConfigForm(prev => ({ ...prev, environment: "sandbox" }))}
                      className="text-primary"
                    />
                    <span className="text-sm">Sandbox</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="environment"
                      checked={configForm.environment === "production"}
                      onChange={() => setConfigForm(prev => ({ ...prev, environment: "production" }))}
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
                    onChange={e => setConfigForm(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  onChange={e => setConfigForm(prev => ({ ...prev, apiSecret: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhookUrl"
                    value={configForm.webhookUrl}
                    onChange={e => setConfigForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
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
                  Configure this URL in your {selectedIntegration.name} dashboard to receive events
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch id="autoSync" />
                  <Label htmlFor="autoSync" className="text-sm">Enable auto-sync</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedIntegration(null)}>
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
