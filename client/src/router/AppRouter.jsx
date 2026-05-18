import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// Layouts
import MainLayout from "@/components/layouts/MainLayout";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Public Pages
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Resources from "@/pages/Resources";
import Assessment from "@/pages/Assessment";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import ChildProfile from "@/pages/ChildProfile";

// Dashboard Sub-pages
import DashboardAssessments from "./dashboard/DashboardAssessments";
import DashboardChildren from "./dashboard/DashboardChildren";
import DashboardPrograms from "./dashboard/DashboardPrograms";
import DashboardProgress from "./dashboard/DashboardProgress";
import DashboardNotifications from "./dashboard/DashboardNotifications";
import DashboardSettings from "./dashboard/DashboardSettings";
import DashboardSubscriptions from "./dashboard/DashboardSubscriptions";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Auth Route Component (redirect if already logged in)
function AuthRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes (no layout) */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="assessments" element={<DashboardAssessments />} />
        <Route path="children" element={<DashboardChildren />} />
        <Route path="children/:id" element={<ChildProfile />} />
        <Route path="programs" element={<DashboardPrograms />} />
        <Route path="progress" element={<DashboardProgress />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="subscriptions" element={<DashboardSubscriptions />} />
      </Route>
    </Routes>
  );
}
