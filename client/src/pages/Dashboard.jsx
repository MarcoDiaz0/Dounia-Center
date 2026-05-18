import { Link } from "react-router-dom";
import {
  ClipboardList,
  Users,
  Calendar,
  Bell,
  TrendingUp,
  BookOpen,
  Clock,
  ChevronLeft,
} from "lucide-react";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import { useChildStore } from "@/store/childStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useEffect, useMemo, useState } from "react";
import { subscriptionService } from "@/services/subscriptionService";

const PROGRAM_COLORS = [
  { bg: "bg-purple-100", icon: "text-purple-600" },
  { bg: "bg-blue-100", icon: "text-blue-600" },
  { bg: "bg-teal-100", icon: "text-teal-600" },
  { bg: "bg-amber-100", icon: "text-amber-600" },
];


export default function Dashboard() {
  const { user } = useAuthStore();
  const { children, getChildren } = useChildStore();
  const { notifications, getNotifications } = useNotificationStore();
  const [mySubscriptions, setMySubscriptions] = useState([]);

  useEffect(() => {
    getChildren();
    getNotifications();
    if (user?.role === "parent") {
      fetchMySubscriptions();
    }
  }, []);

  const fetchMySubscriptions = async () => {
    try {
      const data = await subscriptionService.getMySubscriptions();
      setMySubscriptions(data);
    } catch (e) {
      console.error("Failed to fetch subscriptions:", e);
    }
  };

  // Derive stats dynamically
  const totalAssessments = useMemo(
    () => children.reduce((sum, c) => sum + (c.assessments?.length || 0), 0),
    [children]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Aggregate all enrolled programs across children and active subscriptions
  const enrolledPrograms = useMemo(() => {
    const programs = [];
    // 1. Add child enrolled programs
    children.forEach((child) => {
      (child.enrolledPrograms || []).forEach((program) => {
        programs.push({ ...program, childName: child.fullName });
      });
    });
    // 2. Add confirmed subscription programs that are not yet enrolled under children
    mySubscriptions.forEach((sub) => {
      if (sub.status === "confirmed" && sub.program) {
        const alreadyAdded = programs.some((p) => p._id === sub.program._id);
        if (!alreadyAdded) {
          programs.push({ ...sub.program, childName: "الاشتراك نشط" });
        }
      }
    });
    return programs;
  }, [children, mySubscriptions]);

  const quickStats = [
    {
      label: "نتائج التقييم",
      value: totalAssessments,
      icon: ClipboardList,
      color: "bg-purple-100 text-purple-600",
      href: "/dashboard/assessments",
    },
    {
      label: "ملفات الأطفال",
      value: children.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      href: "/dashboard/children",
    },
    {
      label: "إشعارات جديدة",
      value: unreadCount,
      icon: Bell,
      color: "bg-amber-100 text-amber-600",
      href: "/dashboard/notifications",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800">
            مرحباً، {user?.fullName || "مستخدم"}
          </h1>
          <p className="text-primary-600">إليك ملخص نشاط حسابك</p>
        </div>
        <Link to="/assessment">
          <Button icon={ClipboardList}>تقييم جديد</Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <Link key={stat.label} to={stat.href}>
            <Card hover className="h-full">
              <CardContent className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-800">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary-600">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Children Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>تقدم الأطفال</CardTitle>
              <Link
                to="/dashboard/children"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                عرض الكل
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {children.length === 0 ? (
                <p className="text-sm text-primary-500 text-center py-6">
                  لا يوجد أطفال بعد
                </p>
              ) : (
                <div className="space-y-4">
                  {children.slice(0, 4).map((child) => {
                    const latestAssessment =
                      child.assessments?.[child.assessments.length - 1];
                    const avgScore = latestAssessment
                      ? Math.round(
                          Object.values(latestAssessment.results).reduce(
                            (a, b) => a + b,
                            0
                          ) / Object.values(latestAssessment.results).length
                        )
                      : 0;

                    return (
                      <Link
                        key={child._id}
                        to={`/dashboard/children/${child._id}`}
                        className="flex items-center gap-4 p-4 bg-cream rounded-xl hover:bg-secondary-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-semibold text-primary-700">
                            {child.firstName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-primary-800">
                            {child.fullName}
                          </p>
                          <p className="text-sm text-primary-600 flex items-center gap-2">
                            <span>{child.age?.years} سنوات</span>
                            {user?.role === "admin" &&
                              child.parent?.fullName && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                  ولي الأمر: {child.parent.fullName}
                                </span>
                              )}
                          </p>
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp
                              className={`w-4 h-4 ${avgScore >= 70 ? "text-primary-500" : "text-amber-500"}`}
                            />
                            <span className="font-semibold text-primary-800">
                              {avgScore}%
                            </span>
                          </div>
                          <p className="text-xs text-primary-500">متوسط التقدم</p>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-primary-400" />
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>الإشعارات</CardTitle>
            <Link
              to="/dashboard/notifications"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-sm text-primary-500 text-center py-4">
                  لا توجد إشعارات جديدة
                </p>
              ) : (
                notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif._id}
                    className={`flex gap-3 pb-4 border-b border-secondary-100 last:border-0 last:pb-0 ${notif.isRead ? "opacity-60" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        notif.type === "child_added"
                          ? "bg-primary-100 text-primary-600"
                          : notif.type === "session"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {notif.type === "child_added" ? (
                        <Users className="w-4 h-4" />
                      ) : notif.type === "session" ? (
                        <Calendar className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-primary-700 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-xs text-primary-500 mt-1">
                        {new Date(notif.createdAt).toLocaleDateString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Enrolled Programs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>البرامج المسجلة</CardTitle>
          <Link
            to="/dashboard/programs"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {enrolledPrograms.length === 0 ? (
            <p className="text-sm text-primary-500 text-center py-6">
              لا توجد برامج مسجلة
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrolledPrograms.slice(0, 6).map((program, index) => {
                const colors = PROGRAM_COLORS[index % PROGRAM_COLORS.length];
                return (
                  <div key={`${program._id}-${index}`} className="p-4 bg-cream rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}
                      >
                        <BookOpen className={`w-5 h-5 ${colors.icon}`} />
                      </div>
                      <div>
                        <p className="font-medium text-primary-800">
                          {program.name}
                        </p>
                        <p className="text-xs text-primary-500">
                          {program.childName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary-600">الفئة</span>
                      <span className="font-medium text-primary-700 text-xs">
                        {program.category === "concentration"
                          ? "تركيز"
                          : program.category === "reading"
                            ? "قراءة"
                            : program.category === "writing"
                              ? "كتابة"
                              : program.category === "behavior"
                                ? "سلوك"
                                : program.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
