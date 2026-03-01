import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PhasePage from "./pages/PhasePage";
import Phase1Page from "./pages/Phase1Page";
import Phase2Page from "./pages/Phase2Page";
import Phase3Page from "./pages/Phase3Page";
import Phase4Page from "./pages/Phase4Page";
import Phase5Page from "./pages/Phase5Page";
import Phase6Page from "./pages/Phase6Page";
import Phase7Page from "./pages/Phase7Page";
import Phase8Page from "./pages/Phase8Page";
import Phase9Page from "./pages/Phase9Page";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return <AppLayout>{children}</AppLayout>;
}

function AuthRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return <Auth />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<AuthRoute />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/phase/1" element={<ProtectedRoute><Phase1Page /></ProtectedRoute>} />
              <Route path="/phase/2" element={<ProtectedRoute><Phase2Page /></ProtectedRoute>} />
              <Route path="/phase/3" element={<ProtectedRoute><Phase3Page /></ProtectedRoute>} />
              <Route path="/phase/4" element={<ProtectedRoute><Phase4Page /></ProtectedRoute>} />
              <Route path="/phase/5" element={<ProtectedRoute><Phase5Page /></ProtectedRoute>} />
              <Route path="/phase/6" element={<ProtectedRoute><Phase6Page /></ProtectedRoute>} />
              <Route path="/phase/7" element={<ProtectedRoute><Phase7Page /></ProtectedRoute>} />
              <Route path="/phase/8" element={<ProtectedRoute><Phase8Page /></ProtectedRoute>} />
              <Route path="/phase/9" element={<ProtectedRoute><Phase9Page /></ProtectedRoute>} />
              <Route path="/phase/:phaseNumber" element={<ProtectedRoute><PhasePage /></ProtectedRoute>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
