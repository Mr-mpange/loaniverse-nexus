import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, AlertTriangle, Plug, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface NotificationPreferences {
  email: string;
  audit_critical: boolean;
  integration_alerts: boolean;
}

export function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: "",
    audit_critical: true,
    integration_alerts: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setPreferences({
          email: data.email,
          audit_critical: data.audit_critical,
          integration_alerts: data.integration_alerts,
        });
      } else {
        // Set default email from user
        setPreferences(prev => ({
          ...prev,
          email: user?.email || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("notification_settings")
        .upsert({
          user_id: user.id,
          email: preferences.email,
          audit_critical: preferences.audit_critical,
          integration_alerts: preferences.integration_alerts,
        }, {
          onConflict: "user_id",
        });

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (type: "audit_critical" | "integration_alert") => {
    try {
      setIsTesting(true);
      const { error } = await supabase.functions.invoke("send-notification", {
        body: {
          type,
          subject: type === "audit_critical" ? "Test Critical Alert" : "Test Integration Alert",
          message: "This is a test notification from LMA NEXUS to verify your email settings are working correctly.",
          details: {
            "Test Type": type === "audit_critical" ? "Critical Audit Event" : "Integration Health Alert",
            "Timestamp": new Date().toLocaleString(),
            "Status": "Test notification",
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Test Sent",
        description: `Test ${type === "audit_critical" ? "critical alert" : "integration alert"} sent to ${preferences.email}`,
      });
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification. Please check your email settings.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            Notification Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure email alerts for critical events and system health
          </p>
        </div>
        {hasChanges && (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            Unsaved Changes
          </Badge>
        )}
      </div>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Address
          </CardTitle>
          <CardDescription>
            Where you'll receive notification emails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Notification Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={preferences.email}
              onChange={(e) => updatePreference("email", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This email will receive all enabled notifications
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Choose which events trigger email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Critical Audit Events */}
          <div className="flex items-start justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  Critical Audit Events
                  <Badge variant="destructive" className="text-xs">High Priority</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Receive alerts for unauthorized access attempts, data breaches, compliance violations, and critical system errors
                </p>
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestNotification("audit_critical")}
                    disabled={isTesting || !preferences.email}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Send Test
                  </Button>
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.audit_critical}
              onCheckedChange={(checked) => updatePreference("audit_critical", checked)}
            />
          </div>

          {/* Integration Health Alerts */}
          <div className="flex items-start justify-between p-4 rounded-lg border border-warning/20 bg-warning/5">
            <div className="flex gap-4">
              <div className="p-2 rounded-lg bg-warning/10">
                <Plug className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  Integration Health Alerts
                  <Badge className="bg-warning/20 text-warning border-0 text-xs">Medium Priority</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified when API integrations fail, connection timeouts occur, or sync errors are detected
                </p>
                <div className="mt-3 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTestNotification("integration_alert")}
                    disabled={isTesting || !preferences.email}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Send Test
                  </Button>
                </div>
              </div>
            </div>
            <Switch
              checked={preferences.integration_alerts}
              onCheckedChange={(checked) => updatePreference("integration_alerts", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
          <CardDescription>
            Recent notifications sent to your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: "critical", title: "Unauthorized Access Attempt", time: "2 hours ago", status: "sent" },
              { type: "integration", title: "Finastra Sync Completed", time: "5 hours ago", status: "sent" },
              { type: "integration", title: "SAP Connection Restored", time: "1 day ago", status: "sent" },
            ].map((notification, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center gap-3">
                  {notification.type === "critical" ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Plug className="h-4 w-4 text-warning" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {notification.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
