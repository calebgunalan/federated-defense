import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Page1Dashboard from "./pages/sim/Page1Dashboard";
import Page2Dataset from "./pages/sim/Page2Dataset";
import Page3Baseline from "./pages/sim/Page3Baseline";
import Page4TwoClient from "./pages/sim/Page4TwoClient";
import Page5ThreeClient from "./pages/sim/Page5ThreeClient";
import Page6Ablation from "./pages/sim/Page6Ablation";
import Page7Statistical from "./pages/sim/Page7Statistical";
import Page8Latex from "./pages/sim/Page8Latex";
import Page9Submission from "./pages/sim/Page9Submission";
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
              <Route path="/" element={<ProtectedRoute><Page1Dashboard /></ProtectedRoute>} />
              <Route path="/dataset" element={<ProtectedRoute><Page2Dataset /></ProtectedRoute>} />
              <Route path="/baseline" element={<ProtectedRoute><Page3Baseline /></ProtectedRoute>} />
              <Route path="/two-client" element={<ProtectedRoute><Page4TwoClient /></ProtectedRoute>} />
              <Route path="/three-client" element={<ProtectedRoute><Page5ThreeClient /></ProtectedRoute>} />
              <Route path="/ablation" element={<ProtectedRoute><Page6Ablation /></ProtectedRoute>} />
              <Route path="/statistical" element={<ProtectedRoute><Page7Statistical /></ProtectedRoute>} />
              <Route path="/latex" element={<ProtectedRoute><Page8Latex /></ProtectedRoute>} />
              <Route path="/submission" element={<ProtectedRoute><Page9Submission /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
