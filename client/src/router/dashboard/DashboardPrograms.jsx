import { useEffect, useState } from "react";
import { subscriptionService } from "@/services/subscriptionService";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { BookOpen, RefreshCw, Smartphone, Wallet, Clock, CheckCircle2, AlertTriangle, XCircle, Heart, Brain } from "lucide-react";
import toast from "react-hot-toast";

const iconMap = {
  Heart: Heart,
  Brain: Brain,
  BookOpen: BookOpen,
};

export default function DashboardPrograms() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // active, pending, history

  useEffect(() => {
    fetchMySubscriptions();
  }, []);

  const fetchMySubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getMySubscriptions();
      setSubscriptions(data);
    } catch (error) {
      toast.error("فشل تحميل البرامج والاشتراكات");
    } finally {
      setLoading(false);
    }
  };

  const confirmedSubscriptions = subscriptions.filter((sub) => sub.status === "confirmed");
  const pendingSubscriptions = subscriptions.filter((sub) => sub.status === "pending");
  const otherSubscriptions = subscriptions.filter((sub) => sub.status === "rejected");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800">برامجي واشتراكاتي</h1>
          <p className="text-primary-600">عرض وتتبع البرامج التي تم حجزها وتأكيدها</p>
        </div>
        <Button
          variant="secondary"
          icon={RefreshCw}
          onClick={fetchMySubscriptions}
          disabled={loading}
        >
          تحديث البرامج
        </Button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-secondary-200">
        <button
          onClick={() => setActiveTab("active")}
          className={`pb-3 px-6 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "active"
              ? "border-primary-500 text-primary-700"
              : "border-transparent text-primary-500 hover:text-primary-600"
          }`}
        >
          البرامج المشتركة ({confirmedSubscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 px-6 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "pending"
              ? "border-primary-500 text-primary-700"
              : "border-transparent text-primary-500 hover:text-primary-600"
          }`}
        >
          طلبات قيد المراجعة ({pendingSubscriptions.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 px-6 text-sm font-semibold transition-all border-b-2 ${
            activeTab === "history"
              ? "border-primary-500 text-primary-700"
              : "border-transparent text-primary-500 hover:text-primary-600"
          }`}
        >
          الطلبات المرفوضة ({otherSubscriptions.length})
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-3xl shadow-soft">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === "active" && (
            confirmedSubscriptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-secondary-100 shadow-soft">
                <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary-800 mb-1">لا توجد برامج نشطة حالياً</h3>
                <p className="text-primary-650 mb-6">احجز برامج تعليمية مميزة لدعم وتطوير مهارات طفلك.</p>
                <Button onClick={() => window.location.href = "/services"}>استعرض الخدمات والبرامج</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {confirmedSubscriptions.map((sub) => {
                  const program = sub.program;
                  if (!program) return null;
                  const IconComp = iconMap[program.icon] || BookOpen;

                  return (
                    <Card key={sub._id} className="h-full border border-green-100 bg-white hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                              <IconComp className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              مشترك ومؤكد
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-primary-850 text-lg leading-snug">{program.name}</h3>
                            <p className="text-xs text-primary-500 mt-1">{program.duration}</p>
                          </div>

                          <p className="text-sm text-primary-650 line-clamp-3 leading-relaxed">
                            {program.description}
                          </p>

                          {program.features && program.features.length > 0 && (
                            <div className="pt-2">
                              <ul className="space-y-1.5 text-xs text-primary-600">
                                {program.features.slice(0, 3).map((feat, i) => (
                                  <li key={i} className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-secondary-100 flex items-center justify-between text-xs text-primary-500">
                          <span>تاريخ الاشتراك:</span>
                          <span>{new Date(sub.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          )}

          {activeTab === "pending" && (
            pendingSubscriptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-secondary-100 shadow-soft">
                <Clock className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary-800 mb-1">لا توجد طلبات معلقة</h3>
                <p className="text-primary-650">عمليات الاشتراك والتحويل الخاصة بك تم تأكيدها بالكامل.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingSubscriptions.map((sub) => {
                  const program = sub.program;
                  if (!program) return null;
                  const IconComp = iconMap[program.icon] || BookOpen;

                  return (
                    <Card key={sub._id} className="h-full border border-amber-100 bg-white">
                      <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                              <IconComp className="w-6 h-6 text-amber-600" />
                            </div>
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse">
                              <Clock className="w-3.5 h-3.5" />
                              قيد المراجعة
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-primary-850 text-lg leading-snug">{program.name}</h3>
                            <p className="text-xs text-primary-550 mt-1">{program.price} د.ج / {program.duration}</p>
                          </div>

                          <div className="p-3 bg-secondary-50/50 rounded-xl border border-secondary-100 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-primary-500">طريقة الدفع:</span>
                              <span className="font-medium text-primary-850 flex items-center gap-1">
                                {sub.paymentMethod === "baridimob" ? (
                                  <>
                                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                                    بريدي موب
                                  </>
                                ) : (
                                  <>
                                    <Wallet className="w-3.5 h-3.5 text-purple-600" />
                                    RedotPay
                                  </>
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-primary-500">رقم المعاملة:</span>
                              <span className="font-mono bg-cream py-0.5 px-2 rounded border border-secondary-200 text-primary-800">
                                {sub.transactionNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-100">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p className="leading-normal">يقوم مديرو النظام بالتحقق يدوياً من العملية الآن. سيتم تفعيل حسابك مباشرة عند التأكيد.</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          )}

          {activeTab === "history" && (
            otherSubscriptions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-secondary-100 shadow-soft">
                <XCircle className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary-800 mb-1">لا توجد طلبات مرفوضة</h3>
                <p className="text-primary-650">سجل المدفوعات والاشتراكات الخاص بك خالٍ من أي طلبات مرفوضة.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherSubscriptions.map((sub) => {
                  const program = sub.program;
                  if (!program) return null;
                  const IconComp = iconMap[program.icon] || BookOpen;

                  return (
                    <Card key={sub._id} className="h-full border border-red-100 bg-white">
                      <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                              <IconComp className="w-6 h-6 text-red-600" />
                            </div>
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                              <XCircle className="w-3.5 h-3.5" />
                              تم الرفض
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-primary-850 text-lg leading-snug">{program.name}</h3>
                            <p className="text-xs text-primary-550 mt-1">{program.duration}</p>
                          </div>

                          <p className="text-sm text-red-750 font-medium">
                            * لم نتمكن من العثور على معاملة مطابقة للرقم المرسل: <span className="font-mono underline">{sub.transactionNumber}</span>. يرجى مراجعة تفاصيل التحويل أو إعادة المحاولة برقم معاملة صحيح.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-secondary-100 flex items-center justify-between text-xs text-primary-500">
                          <span>تاريخ الطلب:</span>
                          <span>{new Date(sub.createdAt).toLocaleDateString("ar-EG")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
