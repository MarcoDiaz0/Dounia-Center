import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronLeft, TrendingUp, Calendar } from "lucide-react";
import { useChildStore } from "@/store/childStore";
import { useAuthStore } from "@/store/authStore";
import Card, { CardContent } from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function DashboardChildren() {
  const { children, getChildren, isLoading } = useChildStore();
  const { user } = useAuthStore();

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
                        {user?.role === "admin" && child.parent?.fullName && (
                          <p className="text-xs text-amber-600 mt-1 font-medium">
                            ولي الأمر: {child.parent.fullName}
                          </p>
                        )}
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
