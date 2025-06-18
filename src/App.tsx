
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AuthWithRoles from "./pages/AuthWithRoles";
import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/StudentDashboard";
import CreateAssistant from "./pages/CreateAssistant";
import EditAssistant from "./pages/EditAssistant";
import StudentChat from "./pages/StudentChat";
import AssistantAnalytics from "./pages/AssistantAnalytics";
import Transparency from "./pages/Transparency";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirect to dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    // Here we would check user role and redirect accordingly
    // For now, redirect educators to dashboard and students to student dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <Index />
        </PublicRoute>
      } />
      <Route path="/auth" element={
        <PublicRoute>
          <AuthWithRoles />
        </PublicRoute>
      } />
      <Route path="/transparency" element={<Transparency />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/student-dashboard" element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-assistant" element={
        <ProtectedRoute>
          <CreateAssistant />
        </ProtectedRoute>
      } />
      <Route path="/assistant/:id/edit" element={
        <ProtectedRoute>
          <EditAssistant />
        </ProtectedRoute>
      } />
      <Route path="/assistant/:id/analytics" element={
        <ProtectedRoute>
          <AssistantAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/chat/:id" element={<StudentChat />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
