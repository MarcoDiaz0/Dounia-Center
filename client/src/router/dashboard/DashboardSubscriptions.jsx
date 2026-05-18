import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { subscriptionService } from "@/services/subscriptionService";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Check, X, ShieldAlert, Smartphone, Wallet, RefreshCw, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardSubscriptions() {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchSubscriptions();
    }
  }, [isAdmin]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      toast.error("فشل تحميل طلبات الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await subscriptionService.updateSubscriptionStatus(id, status);
      toast.success(status === "confirmed" ? "تم تأكيد الاشتراك بنجاح" : "تم رفض طلب الاشتراك");
      fetchSubscriptions();
    } catch (error) {
      toast.error("فشل تحديث حالة الاشتراك");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("تم نسخ رقم المعاملة");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-3xl shadow-soft">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-primary-800 mb-2">غير مصرح بالدخول</h2>
        <p className="text-primary-600">هذه الصفحة مخصصة لمديري النظام فقط.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800">إدارة الاشتراكات والمدفوعات</h1>
          <p className="text-primary-600">عرض وتأكيد عمليات الدفع اليدوية للبرامج</p>
        </div>
        <Button
          variant="secondary"
          icon={RefreshCw}
          onClick={fetchSubscriptions}
          disabled={loading}
        >
          تحديث البيانات
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>طلبات الاشتراك الواردة</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 text-primary-500">
              لا توجد طلبات اشتراك في الوقت الحالي.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-secondary-200 text-primary-700 text-sm font-semibold">
                    <th className="pb-3 pt-2 px-4">المشترك (ولي الأمر)</th>
                    <th className="pb-3 pt-2 px-4">البرنامج المطلوب</th>
                    <th className="pb-3 pt-2 px-4">طريقة الدفع</th>
                    <th className="pb-3 pt-2 px-4">رقم المعاملة</th>
                    <th className="pb-3 pt-2 px-4">التاريخ</th>
                    <th className="pb-3 pt-2 px-4">الحالة</th>
                    <th className="pb-3 pt-2 px-4 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100 text-sm">
                  {subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-primary-50/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-primary-850">
                          {sub.user?.fullName || "مستخدم غير معروف"}
                        </div>
                        <div className="text-xs text-primary-500 space-y-0.5">
                          <div>{sub.user?.email}</div>
                          {sub.user?.phone && <div>{sub.user.phone}</div>}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-primary-800">
                          {sub.program?.name || "برنامج محذوف"}
                        </div>
                        <div className="text-xs text-primary-600">
                          {sub.program?.price} د.ج / {sub.program?.duration}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          sub.paymentMethod === "baridimob" 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "bg-purple-50 text-purple-700 border border-purple-100"
                        }`}>
                          {sub.paymentMethod === "baridimob" ? (
                            <>
                              <Smartphone className="w-3.5 h-3.5" />
                              بريدي موب
                            </>
                          ) : (
                            <>
                              <Wallet className="w-3.5 h-3.5" />
                              RedotPay
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-mono bg-cream py-1 px-2.5 rounded-lg border border-secondary-200 w-fit text-xs text-primary-800">
                          <span>{sub.transactionNumber}</span>
                          <button
                            onClick={() => handleCopy(sub.transactionNumber, sub._id)}
                            className="p-1 hover:bg-secondary-200 rounded-md transition-colors"
                            title="نسخ رقم المعاملة"
                          >
                            {copiedId === sub._id ? (
                              <CheckCircle className="w-3.5 h-3.5 text-green-650 animate-scale-in" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-primary-600" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-primary-600 text-xs">
                        {new Date(sub.createdAt).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          sub.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : sub.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {sub.status === "pending" && "قيد المراجعة"}
                          {sub.status === "confirmed" && "مقبول ومؤكد"}
                          {sub.status === "rejected" && "مرفوض"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-left">
                        {sub.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateStatus(sub._id, "rejected")}
                              disabled={updatingId === sub._id}
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="رفض المعاملة"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(sub._id, "confirmed")}
                              disabled={updatingId === sub._id}
                              className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="تأكيد وتأهيل الاشتراك"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
