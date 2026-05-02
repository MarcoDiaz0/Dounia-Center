import { Routes, Route, Navigate, Link } from "react-router-dom";
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

// Protected Pages
import Dashboard from "@/pages/Dashboard";
import ChildProfile from "@/pages/ChildProfile";
import { useEffect } from "react";
import { Plus, ChevronLeft, TrendingUp, Calendar } from "lucide-react";
import { useChildStore } from "@/store/childStore";
import Card, { CardContent } from "@/components/common/Card";
import Button from "@/components/common/Button";

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

// Dashboard Placeholder Pages
function DashboardAssessments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">نتائج التقييم</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <p className="text-primary-600">سيتم عرض نتائج التقييم هنا</p>
      </div>
    </div>
  );
}
export function DashboardChildren() {
  const { children, getChildren, isLoading } = useChildStore();

  useEffect(() => {
    getChildren();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-800">ملفات الأطفال</h1>
        <Link to="/assessment">
          <Button icon={Plus}>إضافة طفل</Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-20 text-primary-500">
          جاري التحميل...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && children.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-primary-600 mb-4">لا توجد ملفات أطفال بعد</p>
          <Link to="/assessment">
            <Button icon={Plus}>أضف طفلك الأول</Button>
          </Link>
        </div>
      )}

      {/* Children Grid */}
      {!isLoading && children.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => {
            const latestAssessment =
              child.assessments?.[child.assessments.length - 1];
            const avgScore = latestAssessment
              ? Math.round(
                  Object.values(latestAssessment.results).reduce(
                    (a, b) => a + b,
                    0,
                  ) / Object.values(latestAssessment.results).length,
                )
              : null;

            return (
              <Link key={child._id} to={`/dashboard/children/${child._id}`}>
                <Card hover className="h-full">
                  <CardContent className="flex flex-col gap-4">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-2xl font-bold text-primary-700">
                          {child.firstName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary-800">
                          {child.fullName}
                        </p>
                        <p className="text-sm text-primary-500">
                          {child.age?.years} سنوات ·{" "}
                          {child.gender === "male" ? "ذكر" : "أنثى"}
                        </p>
                      </div>
                    </div>

                    {/* Programs */}
                    {child.enrolledPrograms?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {child.enrolledPrograms.map((program) => (
                          <span
                            key={program._id}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium"
                          >
                            {program.category === "concentration"
                              ? "تركيز"
                              : program.category === "reading"
                                ? "قراءة"
                                : program.category === "writing"
                                  ? "كتابة"
                                  : program.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-secondary-100 text-sm">
                      <span className="flex items-center gap-1 text-primary-500">
                        <Calendar className="w-4 h-4" />
                        {child.sessions?.length || 0} جلسات
                      </span>
                      {avgScore !== null ? (
                        <span className="flex items-center gap-1 font-semibold text-primary-700">
                          <TrendingUp className="w-4 h-4" />
                          {avgScore}%
                        </span>
                      ) : (
                        <span className="text-primary-400 text-xs">
                          لا يوجد تقييم
                        </span>
                      )}
                      <ChevronLeft className="w-4 h-4 text-primary-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DashboardPrograms() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">البرامج المسجلة</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <p className="text-primary-600">سيتم عرض البرامج المسجلة هنا</p>
      </div>
    </div>
  );
}

function DashboardSessions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">الجلسات القادمة</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <p className="text-primary-600">سيتم عرض الجلسات القادمة هنا</p>
      </div>
    </div>
  );
}

function DashboardProgress() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">التقدم</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <p className="text-primary-600">سيتم عرض تقارير التقدم هنا</p>
      </div>
    </div>
  );
}

function DashboardNotifications() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">الإشعارات</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <p className="text-primary-600">سيتم عرض الإشعارات هنا</p>
      </div>
    </div>
  );
}

function DashboardSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">الإعدادات</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
        <p className="text-primary-600">سيتم عرض إعدادات الحساب هنا</p>
      </div>
    </div>
  );
}

// 404 Page
function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-300 mb-4">404</h1>
        <p className="text-xl text-primary-700 mb-6">الصفحة غير موجودة</p>
        <a href="/" className="btn-primary">
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
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
        <Route path="sessions" element={<DashboardSessions />} />
        <Route path="progress" element={<DashboardProgress />} />
        <Route path="notifications" element={<DashboardNotifications />} />
        <Route path="settings" element={<DashboardSettings />} />
      </Route>
    </Routes>
  );
}
