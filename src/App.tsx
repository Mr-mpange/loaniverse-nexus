import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardRedirect } from "@/components/auth/DashboardRedirect";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import LoanOfficerDashboard from "./pages/LoanOfficerDashboard";
import TraderDashboard from "./pages/TraderDashboard";
import ComplianceDashboard from "./pages/ComplianceDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import DocumentsPage from "./pages/DocumentsPage";
import TradingPage from "./pages/TradingPage";
import CompliancePage from "./pages/CompliancePage";
import LoanLifecyclePage from "./pages/LoanLifecyclePage";
import ESGPage from "./pages/ESGPage";
import ReportsPage from "./pages/ReportsPage";
import ScheduledReportsPage from "./pages/ScheduledReportsPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import AuditLogPage from "./pages/AuditLogPage";
import TeamManagementPage from "./pages/TeamManagementPage";
import SettingsPage from "./pages/SettingsPage";
import RoleSelection from "./pages/RoleSelection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              
              {/* Role selection for users without assigned roles */}
              <Route
                path="/select-role"
                element={
                  <ProtectedRoute>
                    <RoleSelection />
                  </ProtectedRoute>
                }
              />
              
              {/* Dashboard redirect - automatically routes to role-specific dashboard */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />
              
              {/* Role-specific dashboard routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/loan-officer"
                element={
                  <ProtectedRoute allowedRoles={['loan_officer', 'admin']}>
                    <LoanOfficerDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/trader"
                element={
                  <ProtectedRoute allowedRoles={['trader', 'admin']}>
                    <TraderDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/compliance"
                element={
                  <ProtectedRoute allowedRoles={['compliance_officer', 'admin']}>
                    <ComplianceDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Individual section routes */}
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/documents"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'loan_officer']}>
                    <DocumentsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/trading"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'trader']}>
                    <TradingPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/compliance-engine"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'compliance_officer']}>
                    <CompliancePage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/loan-lifecycle"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'loan_officer']}>
                    <LoanLifecyclePage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/esg"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'loan_officer', 'compliance_officer']}>
                    <ESGPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/scheduled-reports"
                element={
                  <ProtectedRoute>
                    <ScheduledReportsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/integrations"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <IntegrationsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/audit-log"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'compliance_officer']}>
                    <AuditLogPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/team"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TeamManagementPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/settings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
