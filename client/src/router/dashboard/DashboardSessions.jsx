import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useSessionStore } from "@/store/sessionStore";
import { subscriptionService } from "@/services/subscriptionService";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import Button from "@/components/common/Button";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Phone,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardSessions() {
  const { user, checkAuth } = useAuthStore();
  const {
    sessions,
    isLoading,
    createSession,
    fetchMySessions,
    fetchAllSessions,
    respondToSession,
  } = useSessionStore();

  const [myPrograms, setMyPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  
  // Respond Form State
  const [selectedSession, setSelectedSession] = useState(null);
  const [respondStatus, setRespondStatus] = useState("confirmed");
  const [respondTime, setRespondTime] = useState("");
  const [respondWhere, setRespondWhere] = useState("");
  const [respondNotes, setRespondNotes] = useState("");

  // Booking Form State
  const [bookingProgramId, setBookingProgramId] = useState("");
  const [bookingPhone, setBookingPhone] = useState(user?.phone || "");
  const [bookingMessage, setBookingMessage] = useState("");

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadData();
    if (!isAdmin) {
      loadMyPrograms();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      if (isAdmin) {
        await fetchAllSessions();
      } else {
        await fetchMySessions();
      }
    } catch (error) {
      toast.error("فشل تحميل الحصص");
    }
  };

  const loadMyPrograms = async () => {
    try {
      setLoadingPrograms(true);
      const subs = await subscriptionService.getMySubscriptions();
      // Filter only confirmed subscriptions
      const confirmed = subs.filter((sub) => sub.status === "confirmed" && sub.program);
      setMyPrograms(confirmed.map((sub) => sub.program));
      if (confirmed.length > 0) {
        setBookingProgramId(confirmed[0].program._id);
      }
    } catch (error) {
      toast.error("فشل تحميل البرامج المشتركة");
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!bookingProgramId) {
      toast.error("يرجى اختيار برنامج");
      return;
    }
    if (!bookingPhone.trim()) {
      toast.error("رقم الهاتف مطلوب");
      return;
    }

    try {
      await createSession(bookingProgramId, bookingPhone, bookingMessage);
      toast.success("تم تقديم طلب حجز الحصة بنجاح");
      setShowBookingModal(false);
      setBookingMessage("");
      loadData();
      // If the user's phone wasn't set, update local user storage context
      if (user && !user.phone) {
        await checkAuth();
      }
    } catch (error) {
      toast.error(error.message || "فشل إرسال طلب الحجز");
    }
  };

  const handleOpenRespond = (session) => {
    setSelectedSession(session);
    setRespondStatus("confirmed");
    setRespondTime(session.time || "");
    setRespondWhere(session.where || "");
    setRespondNotes(session.adminNotes || "");
    setShowRespondModal(true);
  };

  const handleRespondSubmit = async (e) => {
    e.preventDefault();
    if (respondStatus === "confirmed" && (!respondTime.trim() || !respondWhere.trim())) {
      toast.error("يجب تحديد وقت ومكان الحصة للموافقة");
      return;
    }

    try {
      await respondToSession(selectedSession.id, {
        status: respondStatus,
        time: respondTime,
        where: respondWhere,
        adminNotes: respondNotes,
      });
      toast.success("تم إرسال ردك وتحديث حالة الحصة");
      setShowRespondModal(false);
      loadData();
    } catch (error) {
      toast.error(error.message || "فشل تحديث حالة الحصة");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900">
            {isAdmin ? "إدارة حصص الاستشارة والتطوير" : "حصصي وجدول المواعيد"}
          </h1>
          <p className="text-primary-600">
            {isAdmin 
              ? "مراجعة طلبات حجز الحصص وتحديد المواعيد لأولياء الأمور" 
              : "حجز ومتابعة حصص الاستشارة الخاصة ببرامجك المشتركة"
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadData}
            disabled={isLoading}
          >
            تحديث البيانات
          </Button>
          {!isAdmin && (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                if (myPrograms.length === 0) {
                  toast.error("يجب أن تكون مشتركاً في برنامج مؤكد لحجز حصة");
                } else {
                  setShowBookingModal(true);
                }
              }}
            >
              حجز حصة جديدة
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isAdmin ? "طلبات حجز الحصص الواردة" : "سجل حجز الحصص الخاص بك"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && sessions.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-secondary-300 rounded-2xl">
              <Calendar className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-primary-800 mb-1">لا توجد حصص محجوزة</h3>
              <p className="text-primary-600 mb-4">
                {isAdmin 
                  ? "لا توجد طلبات حجز حصص من أولياء الأمور حالياً." 
                  : "لم تقم بحجز أي حصة استشارية بعد."
                }
              </p>
              {!isAdmin && myPrograms.length > 0 && (
                <Button onClick={() => setShowBookingModal(true)} icon={Plus}>
                  احجز حصتك الاستشارية الأولى
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-secondary-200 text-primary-700 text-sm font-semibold">
                    {isAdmin && <th className="pb-3 pt-2 px-4">ولي الأمر</th>}
                    <th className="pb-3 pt-2 px-4">البرنامج</th>
                    <th className="pb-3 pt-2 px-4">رقم الهاتف</th>
                    <th className="pb-3 pt-2 px-4">تفاصيل الموعد</th>
                    <th className="pb-3 pt-2 px-4">الملاحظات</th>
                    <th className="pb-3 pt-2 px-4">الحالة</th>
                    {isAdmin && <th className="pb-3 pt-2 px-4 text-left">الإجراءات</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100 text-sm">
                  {sessions.map((sess) => (
                    <tr key={sess._id} className="hover:bg-primary-50/20 transition-colors">
                      {isAdmin && (
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs shrink-0">
                              {sess.parent?.fullName?.charAt(0) || "و"}
                            </div>
                            <div>
                              <div className="font-semibold text-primary-850">
                                {sess.parent?.fullName || "مستخدم"}
                              </div>
                              <div className="text-xs text-primary-500">{sess.parent?.email}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-4 font-semibold text-primary-800">
                        {sess.program?.name || "برنامج محتلف"}
                      </td>
                      <td className="py-4 px-4 font-mono text-primary-700">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-primary-500" />
                          <span>{sess.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {sess.status === "confirmed" ? (
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1 text-primary-800 font-medium">
                              <Clock className="w-3.5 h-3.5 text-primary-650 shrink-0" />
                              <span>{sess.time}</span>
                            </div>
                            <div className="flex items-center gap-1 text-primary-600">
                              <MapPin className="w-3.5 h-3.5 text-primary-550 shrink-0" />
                              <span className="truncate max-w-[200px]" title={sess.where}>{sess.where}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-primary-500">بانتظار تحديد الموعد من الإدارة</span>
                        )}
                      </td>
                      <td className="py-4 px-4 max-w-[250px]">
                        <div className="space-y-1 text-xs">
                          {sess.message && (
                            <div className="text-primary-700 flex items-start gap-1">
                              <MessageSquare className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-2" title={sess.message}>
                                <strong>الرسالة:</strong> {sess.message}
                              </span>
                            </div>
                          )}
                          {sess.adminNotes && (
                            <div className="text-primary-800 flex items-start gap-1 bg-primary-50/50 p-1 rounded">
                              <FileText className="w-3.5 h-3.5 text-primary-650 shrink-0 mt-0.5" />
                              <span className="line-clamp-2 text-primary-900" title={sess.adminNotes}>
                                <strong>الإدارة:</strong> {sess.adminNotes}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sess.status === "pending"
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : sess.status === "confirmed"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {sess.status === "pending" && (
                            <>
                              <Clock className="w-3 h-3 animate-pulse" />
                              <span>قيد المراجعة</span>
                            </>
                          )}
                          {sess.status === "confirmed" && (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>تم التأكيد</span>
                            </>
                          )}
                          {sess.status === "rejected" && (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>ملغى / مرفوض</span>
                            </>
                          )}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-4 px-4 text-left">
                          <Button
                            size="sm"
                            variant={sess.status === "pending" ? "primary" : "outline"}
                            onClick={() => handleOpenRespond(sess)}
                          >
                            {sess.status === "pending" ? "تحديد موعد والرد" : "تعديل الرد"}
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PARENT: BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-secondary-100 text-primary-750"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2">
              <Calendar className="w-12 h-12 text-primary-500 mx-auto" />
              <h2 className="text-xl font-bold text-primary-900">حجز حصة استشارية جديدة</h2>
              <p className="text-sm text-primary-600">
                اختر البرنامج المشترك وأدخل بيانات الاتصال لإرسال طلبك للإدارة
              </p>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4 pt-2">
              {/* Program Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary-750">البرنامج المشترك:</label>
                <select
                  value={bookingProgramId}
                  onChange={(e) => setBookingProgramId(e.target.value)}
                  className="input-base"
                  required
                >
                  {myPrograms.map((prog) => (
                    <option key={prog._id} value={prog._id}>
                      {prog.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary-750">رقم الهاتف للتواصل:</label>
                <input
                  type="tel"
                  placeholder="مثال: 0661234567"
                  value={bookingPhone}
                  onChange={(e) => setBookingPhone(e.target.value)}
                  className="input-base"
                  required
                />
                {!user?.phone && (
                  <p className="text-xs text-amber-700 flex gap-1 items-start mt-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>سيتم حفظ رقم الهاتف هذا تلقائياً في ملفك الشخصي لتسهيل التواصل معك مستقبلاً.</span>
                  </p>
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary-750">ملاحظات أو مواعيد تفضلها (اختياري):</label>
                <textarea
                  placeholder="اكتب رسالة للإدارة بخصوص طبيعة المشكلة أو المواعيد المناسبة لك..."
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className="input-base h-24 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBookingModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN: RESPOND MODAL */}
      {showRespondModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scale-in">
            <button
              onClick={() => setShowRespondModal(false)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-secondary-100 text-primary-750"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="text-center space-y-1">
              <Calendar className="w-12 h-12 text-primary-500 mx-auto" />
              <h2 className="text-xl font-bold text-primary-900">تأكيد وتحديد موعد الحصة</h2>
              <p className="text-xs text-primary-600">
                طلب من الولي: <strong>{selectedSession.parent?.fullName}</strong> لبرنامج <strong>{selectedSession.program?.name}</strong>
              </p>
            </div>

            <form onSubmit={handleRespondSubmit} className="space-y-4 pt-2">
              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary-750">حالة الطلب:</label>
                <select
                  value={respondStatus}
                  onChange={(e) => setRespondStatus(e.target.value)}
                  className="input-base"
                  required
                >
                  <option value="confirmed">قبول وتأكيد الموعد</option>
                  <option value="rejected">رفض / إلغاء الطلب</option>
                </select>
              </div>

              {respondStatus === "confirmed" && (
                <>
                  {/* Time Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-primary-750">توقيت الحصة (الوقت):</label>
                    <input
                      type="text"
                      placeholder="مثال: الإثنين 25 ماي - الساعة 10:00 صباحاً"
                      value={respondTime}
                      onChange={(e) => setRespondTime(e.target.value)}
                      className="input-base"
                      required
                    />
                  </div>

                  {/* Where Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-primary-750">مكان الحصة أو رابط اللقاء:</label>
                    <input
                      type="text"
                      placeholder="مثال: رابط زووم، أو في مقر المركز بالبليدة"
                      value={respondWhere}
                      onChange={(e) => setRespondWhere(e.target.value)}
                      className="input-base"
                      required
                    />
                  </div>
                </>
              )}

              {/* Notes / Reject Reason */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary-750">
                  {respondStatus === "confirmed" ? "رسالة مرافقة للولي (اختياري):" : "سبب الرفض والاعتذار:"}
                </label>
                <textarea
                  placeholder={respondStatus === "confirmed" ? "تعليمات إضافية بخصوص اللقاء..." : "يرجى كتابة سبب رفض الطلب..."}
                  value={respondNotes}
                  onChange={(e) => setRespondNotes(e.target.value)}
                  className="input-base h-24 resize-none"
                  required={respondStatus === "rejected"}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRespondModal(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحفظ..." : "حفظ الموعد"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
