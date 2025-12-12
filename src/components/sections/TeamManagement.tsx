import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Shield, Search, MoreHorizontal, Mail, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type AppRole = "admin" | "loan_officer" | "trader" | "compliance_officer";

interface TeamMember {
  id: string;
  user_id: string;
  role: AppRole;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  created_at: string;
}

const roleConfig: Record<AppRole, { label: string; color: string; description: string }> = {
  admin: { label: "Admin", color: "bg-destructive/20 text-destructive", description: "Full system access" },
  loan_officer: { label: "Loan Officer", color: "bg-primary/20 text-primary", description: "Loan origination & documents" },
  trader: { label: "Trader", color: "bg-success/20 text-success", description: "Trading board access" },
  compliance_officer: { label: "Compliance", color: "bg-warning/20 text-warning", description: "Audit & compliance" },
};

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("loan_officer");
  const { toast } = useToast();
  const { user, hasRole } = useAuth();

  const isAdmin = hasRole("admin");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch user roles with profiles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("id, user_id, role, created_at");

      if (rolesError) throw rolesError;

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url");

      if (profilesError) throw profilesError;

      // Combine data
      const combinedMembers: TeamMember[] = (roles || []).map((role) => {
        const profile = profiles?.find(p => p.id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          role: role.role as AppRole,
          full_name: profile?.full_name || null,
          avatar_url: profile?.avatar_url || null,
          email: "user@example.com", // Would need auth.users access for real email
          created_at: role.created_at,
        };
      });

      setMembers(combinedMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: AppRole) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can change roles",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.map(m => 
        m.id === memberId ? { ...m, role: newRole } : m
      ));

      toast({
        title: "Role Updated",
        description: "Team member role has been updated",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can remove team members",
        variant: "destructive",
      });
      return;
    }

    if (userId === user?.id) {
      toast({
        title: "Cannot Remove",
        description: "You cannot remove yourself from the team",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      setMembers(members.filter(m => m.id !== memberId));

      toast({
        title: "Member Removed",
        description: "Team member has been removed",
      });
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleStats = {
    total: members.length,
    admins: members.filter(m => m.role === "admin").length,
    loan_officers: members.filter(m => m.role === "loan_officer").length,
    traders: members.filter(m => m.role === "trader").length,
    compliance: members.filter(m => m.role === "compliance_officer").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{roleStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>
        {Object.entries(roleConfig).map(([role, config]) => (
          <Card key={role} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{config.label}s</p>
                  <p className="text-2xl font-bold">
                    {roleStats[role === "compliance_officer" ? "compliance" : role === "loan_officer" ? "loan_officers" : `${role}s` as keyof typeof roleStats] || 0}
                  </p>
                </div>
                <Badge className={config.color}>{config.label[0]}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Team Members
            </CardTitle>
            <CardDescription>Manage team roles and permissions</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            {isAdmin && (
              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join the team with a specific role
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="colleague@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AppRole)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(roleConfig).map(([role, config]) => (
                            <SelectItem key={role} value={role}>
                              <div className="flex items-center gap-2">
                                <Badge className={config.color} variant="secondary">
                                  {config.label}
                                </Badge>
                                <span className="text-muted-foreground text-xs">
                                  {config.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => {
                      toast({
                        title: "Invitation Sent",
                        description: `Invitation sent to ${inviteEmail}`,
                      });
                      setIsInviteOpen(false);
                      setInviteEmail("");
                    }}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No team members found</h3>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "Try a different search term" : "Invite team members to get started"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={member.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.full_name?.[0]?.toUpperCase() || member.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.full_name || "Unnamed User"}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        {member.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAdmin && member.user_id !== user?.id ? (
                        <Select 
                          value={member.role} 
                          onValueChange={(v) => handleRoleChange(member.id, v as AppRole)}
                        >
                          <SelectTrigger className="w-40">
                            <Badge className={roleConfig[member.role].color}>
                              {roleConfig[member.role].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roleConfig).map(([role, config]) => (
                              <SelectItem key={role} value={role}>
                                <Badge className={config.color}>{config.label}</Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={roleConfig[member.role].color}>
                          {roleConfig[member.role].label}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {isAdmin && member.user_id !== user?.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleRemoveMember(member.id, member.user_id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Overview of access levels for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(roleConfig).map(([role, config]) => (
              <Card key={role} className="border-border/50">
                <CardContent className="p-4">
                  <Badge className={`${config.color} mb-3`}>{config.label}</Badge>
                  <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                  <ul className="text-xs space-y-1">
                    {role === "admin" && (
                      <>
                        <li>• Full system access</li>
                        <li>• Manage team members</li>
                        <li>• Configure integrations</li>
                        <li>• View all audit logs</li>
                      </>
                    )}
                    {role === "loan_officer" && (
                      <>
                        <li>• Create & manage loans</li>
                        <li>• Generate documents</li>
                        <li>• View loan lifecycle</li>
                        <li>• Access ESG reports</li>
                      </>
                    )}
                    {role === "trader" && (
                      <>
                        <li>• Access trading board</li>
                        <li>• Submit orders</li>
                        <li>• View market data</li>
                        <li>• Trading analytics</li>
                      </>
                    )}
                    {role === "compliance_officer" && (
                      <>
                        <li>• Access compliance engine</li>
                        <li>• View audit logs</li>
                        <li>• Regulatory reports</li>
                        <li>• Risk monitoring</li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
