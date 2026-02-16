import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "@/contexts/RoleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";

// Existing Pages
import Dashboard from "@/pages/Dashboard";
import Grievances from "@/pages/Grievances";
import Internships from "@/pages/Internships";
import LostFound from "@/pages/LostFound";
import Academics from "@/pages/Academics";
import Analytics from "@/pages/Analytics";
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";

// NEW PAGES TO CREATE
import Research from "@/pages/Research";
import Events from "@/pages/Events";
import Announcements from "@/pages/Announcements";
import Users from "@/pages/Users";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import ProfessorDashboard from "@/pages/ProfessorDashboard";
import ClubDashboard from "@/pages/ClubDashboard";
import BusBuddy from "@/pages/BusBuddy";

const queryClient = new QueryClient();

/* ---------------- Protected Route ---------------- */

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking auth state from localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary animate-spin">
            <div className="w-8 h-8 rounded-full bg-slate-900" />
          </div>
          <p className="text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* ---------------- Root Redirect ---------------- */

const RootRedirect = () => {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking auth state from localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary animate-spin">
            <div className="w-8 h-8 rounded-full bg-slate-900" />
          </div>
          <p className="text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

/* ---------------- App ---------------- */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>

                {/* Root Redirect */}
                <Route path="/" element={<RootRedirect />} />

                {/* Public Login */}
                <Route path="/login" element={<Login />} />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Existing Routes */}
                  <Route index element={<Dashboard />} />
                  <Route path="grievances" element={<Grievances />} />
                  <Route path="internships" element={<Internships />} />
                  <Route path="lost-found" element={<LostFound />} />
                  <Route path="academics" element={<Academics />} />
                  <Route path="analytics" element={<Analytics />} />

                  {/* NEW ROUTES - Research & Opportunities */}
                  <Route path="research" element={<Research />} />
                  <Route path="events" element={<Events />} />
                  <Route path="announcements" element={<Announcements />} />
                  <Route path="users" element={<Users />} />
                  
                  {/* Profile & Settings */}
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  
                  {/* Bus Buddy */}
                  <Route path="bus-buddy" element={<BusBuddy />} />
                  
                  {/* Role-Specific Dashboards */}
                  <Route path="professor" element={<ProfessorDashboard />} />
                  <Route path="club" element={<ClubDashboard />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

              </Routes>
            </BrowserRouter>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;