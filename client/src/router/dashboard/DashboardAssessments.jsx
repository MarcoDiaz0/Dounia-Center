import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Send, User } from "lucide-react";
import toast from "react-hot-toast";
import Card, {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useAuthStore } from "@/store/authStore";
import { useChildStore } from "@/store/childStore";
import { useNotificationStore } from "@/store/notificationStore";

const scoreLabels = {
  attention: "الانتباه",
  reading: "القراءة",
  behavior: "السلوك",
  writing: "الكتابة",
};

const getAssessmentTime = (assessment) =>
  new Date(assessment.date || assessment.createdAt || 0).getTime();

export default function DashboardAssessments() {
  const { user } = useAuthStore();
  const { children, getChildren, isLoading } = useChildStore();
  const { notifications, getNotifications, sendNotification, isSending } =
    useNotificationStore();
  const [messages, setMessages] = useState({});

  useEffect(() => {
    getChildren();
    getNotifications();
  }, []);

  const assessmentItems = useMemo(
    () =>
      children
        .flatMap((child) =>
          (child.assessments || []).map((assessment) => ({
            child,
            assessment,
          })),
        )
        .sort(
          (a, b) =>
            getAssessmentTime(b.assessment) - getAssessmentTime(a.assessment),
        ),
    [children],
  );

  const handleSendMessage = async (assessment, child) => {
    const message = messages[assessment._id]?.trim();
    const recipientId = child.parent?.id || child.parent?._id || "";

    if (!recipientId) {
      toast.error("لا يوجد ولي أمر مرتبط بهذا التقييم");
      return;
    }

    if (!message) {
      toast.error("يرجى كتابة رسالة قبل الإرسال");
      return;
    }

    try {
      await sendNotification({
        recipientId,
        message,
        type: "assessment_message",
        relatedId: assessment._id,
      });

      setMessages((prev) => ({ ...prev, [assessment._id]: "" }));
      toast.success("تم إرسال الرسالة إلى ولي الأمر");
    } catch (error) {
      toast.error(error?.response?.data?.message || "فشل إرسال الرسالة");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-800">نتائج التقييم</h1>
        <p className="text-primary-500 mt-1">
          {user?.role === "admin"
            ? "يوجد تحت كل تقييم حقل رسالة مستقل، ويتم إرسال الرسالة تلقائياً إلى ولي الأمر المرتبط بهذا التقييم."
            : "راجع نتائج التقييم الخاصة بأطفالك ورسائل الإدارة المرتبطة بها."}
        </p>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center text-primary-500">
          جاري تحميل نتائج التقييم...
        </div>
      )}

      {!isLoading && assessmentItems.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <ClipboardList className="w-10 h-10 text-primary-300 mx-auto mb-4" />
          <p className="text-primary-600">لا توجد نتائج تقييم محفوظة بعد</p>
        </div>
      )}

      {!isLoading && assessmentItems.length > 0 && (
        <div className="grid gap-6">
          {assessmentItems.map(({ child, assessment }) => {
            const averageScore = Math.round(
              Object.values(assessment.results || {}).reduce(
                (sum, value) => sum + value,
                0,
              ) / Math.max(Object.keys(assessment.results || {}).length, 1),
            );

            const assessmentMessages = notifications.filter(
              (notification) =>
                notification.type === "assessment_message" &&
                String(notification.relatedId) === String(assessment._id),
            );

            return (
              <Card key={assessment._id}>
                <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <CardTitle>
                      {child.fullName} -{" "}
                      {assessment.type === "follow-up" ? "متابعة" : "أولي"}
                    </CardTitle>
                    <CardDescription>
                      تاريخ التقييم:{" "}
                      {new Date(
                        assessment.date || assessment.createdAt,
                      ).toLocaleDateString("ar-DZ")}
                    </CardDescription>
                    {child.parent && (
                      <p className="text-sm text-amber-700 mt-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        ولي الأمر: {child.parent.fullName} ({child.parent.email}
                        )
                      </p>
                    )}
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-primary-50 text-primary-700 font-semibold self-start">
                    المعدل: {averageScore}%
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(assessment.results || {}).map(
                      ([key, value]) => (
                        <div key={key} className="rounded-xl bg-cream p-4">
                          <p className="text-sm text-primary-500 mb-1">
                            {scoreLabels[key] || key}
                          </p>
                          <p className="text-lg font-semibold text-primary-800">
                            {value}%
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  {user?.role === "parent" && assessmentMessages.length > 0 && (
                    <div className="border-t border-secondary-100 pt-5 space-y-3">
                      <h3 className="text-sm font-semibold text-primary-800">
                        رسائل الإدارة حول هذا التقييم
                      </h3>
                      <div className="space-y-3">
                        {assessmentMessages.map((message) => (
                          <div
                            key={message._id}
                            className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3"
                          >
                            <p className="text-primary-800 whitespace-pre-wrap leading-relaxed">
                              {message.message}
                            </p>
                            <p className="text-xs text-primary-500 mt-2">
                              {new Date(message.createdAt).toLocaleString(
                                "ar-DZ",
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {user?.role === "admin" && (
                    <div className="border-t border-secondary-100 pt-5 space-y-4">
                      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                        سيتم إرسال الرسالة تلقائياً إلى ولي الأمر المرتبط بهذا
                        التقييم:
                        <span className="font-semibold">
                          {" "}
                          {child.parent?.fullName || "غير محدد"}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-2">
                          اكتب رسالة طويلة حول نتيجة اللقاء / التقييم
                        </label>
                        <textarea
                          value={messages[assessment._id] || ""}
                          onChange={(e) =>
                            setMessages((prev) => ({
                              ...prev,
                              [assessment._id]: e.target.value,
                            }))
                          }
                          rows={6}
                          className="input-base min-h-36"
                          placeholder="اكتب هنا تفاصيل نتيجة الجلسة، ملاحظاتك، والتوصيات الموجهة لولي الأمر..."
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          icon={Send}
                          onClick={() => handleSendMessage(assessment, child)}
                          loading={isSending}
                        >
                          إرسال الرسالة إلى ولي الأمر
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
