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
