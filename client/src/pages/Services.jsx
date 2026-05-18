import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Brain,
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  Check,
  CreditCard,
  Smartphone,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import Button from "@/components/common/Button";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/common/Card";
import { useAuthStore } from "@/store/authStore";
import { programService } from "@/services/programService";
import { subscriptionService } from "@/services/subscriptionService";
import AddProgramModal from "@/components/programs/AddProgramModal";
import toast from "react-hot-toast";
import { Wallet } from "lucide-react";

const iconMap = {
  Heart,
  Brain,
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
};

const paymentMethods = [
  {
    id: "baridimob",
    name: "BaridiMob (بريدي موب)",
    icon: Smartphone,
    description: "الدفع عبر تطبيق بريدي موب",
    details: "الـ RIP الخاص بنا: 00799999002444555666",
  },
  {
    id: "redotpay",
    name: "RedotPay",
    icon: Wallet,
    description: "الدفع عبر تطبيق RedotPay",
    details: "معرف الحساب (RedotPay ID): 887291044",
  },
];

export default function Services() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await programService.getPrograms();
      setPrograms(data);
    } catch (error) {
      toast.error("فشل تحميل البرامج");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProgram = async (programData) => {
    try {
      await programService.createProgram(programData);
      fetchPrograms();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteProgram = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا البرنامج؟")) {
      try {
        await programService.deleteProgram(id);
        toast.success("تم حذف البرنامج");
        fetchPrograms();
      } catch (error) {
        toast.error("فشل حذف البرنامج");
      }
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSelectedMethod(null);
    setTransactionNumber("");
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!selectedMethod) {
      toast.error("يرجى اختيار طريقة الدفع");
      return;
    }
    if (!transactionNumber.trim()) {
      toast.error("يرجى إدخال رقم المعاملة");
      return;
    }

    try {
      setSubmittingPayment(true);
      await subscriptionService.createSubscription(
        selectedService._id,
        selectedMethod.id,
        transactionNumber
      );
      toast.success("تم إرسال طلب الاشتراك بنجاح بانتظار تأكيد المسؤول");
      setShowPaymentModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل إرسال طلب الاشتراك");
    } finally {
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-bl from-cream via-white to-secondary-100 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              خدماتنا التربوية
            </h1>
            <p className="text-lg text-primary-600 leading-relaxed">
              نقدم مجموعة متكاملة من الخدمات التربوية والإرشادية المصممة خصيصاً
              لدعم نمو طفلك وتطوره
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          {isAdmin && (
            <div className="mb-8 flex justify-end">
              <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>
                إضافة برنامج جديد
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((service) => {
              const IconComponent = iconMap[service.icon] || BookOpen;
              return (
                <Card key={service._id} className="flex flex-col relative group">
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteProgram(service._id)}
                      className="absolute top-4 left-4 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <CardHeader>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-primary-600 mb-4">
                      {service.longDescription}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-primary-700"
                        >
                          <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-2xl font-bold text-primary-700">
                          {service.price}{" "}
                          <span className="text-sm font-normal">د.ج</span>
                        </p>
                        <p className="text-sm text-primary-500">
                          {service.duration}
                        </p>
                      </div>
                    </div>
                    {!isAdmin && (
                      <Button
                        className="w-full"
                        onClick={() => handleSelectService(service)}
                      >
                        احجز الآن
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {programs.length === 0 && !loading && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-secondary-200">
              <p className="text-primary-600">لا توجد برامج متوفرة حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* Bac Support Section */}
      <section className="section-padding bg-gradient-to-l from-primary-600 to-primary-700 text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                <span>برنامج خاص</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                دعم تلاميذ الباكالوريا
              </h2>
              <p className="text-primary-100 text-lg mb-6 leading-relaxed">
                برنامج دعم نفسي وأكاديمي شامل لتلاميذ البكالوريا. نساعدهم على
                التغلب على الضغط والقلق، وتحسين مهارات الدراسة والتحضير
                للامتحانات.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "جلسات دعم نفسي للتعامل مع القلق",
                  "تقنيات إدارة الضغط",
                  "استراتيجيات الدراسة الفعالة",
                  "التحضير للامتحانات",
                  "توجيه مهني وجامعي",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {!isAdmin && (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() =>
                    handleSelectService({
                      name: "دعم تلاميذ الباكالوريا",
                      price: "20,000",
                      duration: "برنامج شامل",
                    })
                  }
                >
                  احجز الآن
                </Button>
              )}
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-white/10 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <GraduationCap className="w-24 h-24 mx-auto mb-4 text-primary-200" />
                  <p className="text-2xl font-bold">برنامج شامل</p>
                  <p className="text-primary-200">للنجاح في الباكالوريا</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-primary-800 mb-4">
            غير متأكد من الخدمة المناسبة؟
          </h2>
          <p className="text-lg text-primary-600 mb-8 max-w-2xl mx-auto">
            ابدأ بتقييم مجاني لمعرفة احتياجات طفلك وسنوصي بالخدمة المناسبة
          </p>
          <Link to="/assessment">
            <Button size="lg" icon={ClipboardCheck}>
              ابدأ التقييم المجاني
            </Button>
          </Link>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary-800">إتمام الحجز</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-xl hover:bg-primary-50 transition-colors"
              >
                <X className="w-5 h-5 text-primary-600" />
              </button>
            </div>

            <div className="bg-primary-50 rounded-2xl p-4 mb-6">
              <p className="font-medium text-primary-800">
                {selectedService.name || selectedService.title}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-primary-600">
                  {selectedService.duration}
                </span>
                <span className="text-lg font-bold text-primary-700">
                  {selectedService.price} د.ج
                </span>
              </div>
            </div>

            <p className="text-sm text-primary-600 mb-3">اختر طريقة الدفع:</p>

            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => {
                const isSelected = selectedMethod?.id === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method)}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-xl transition-all text-right ${
                      isSelected
                        ? "border-primary-500 bg-primary-50/40 shadow-sm"
                        : "border-secondary-200 hover:border-primary-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-primary-100" : "bg-secondary-100"
                    }`}>
                      <method.icon className={`w-6 h-6 ${isSelected ? "text-primary-700" : "text-primary-600"}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary-800">
                        {method.name}
                      </p>
                      <p className="text-xs text-primary-500 mt-0.5">
                        {method.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedMethod && (
              <div className="mb-6 space-y-4 animate-fade-in p-4 bg-secondary-50/50 rounded-2xl border border-secondary-100">
                <div className="bg-white p-3 rounded-xl border border-secondary-100 shadow-sm">
                  <p className="text-xs text-primary-500 mb-1">تفاصيل الدفع:</p>
                  <p className="text-sm font-bold text-primary-800 tracking-wider">
                    {selectedMethod.details}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-primary-700">
                    رقم المعاملة (Transaction ID)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="أدخل رقم المعاملة بعد إرسال المبلغ..."
                    value={transactionNumber}
                    onChange={(e) => setTransactionNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <p className="text-[11px] text-primary-500 leading-normal">
                    * يرجى إتمام التحويل أولاً في التطبيق الخاص بك، ثم كتابة الرقم التعريفي للعملية هنا لمراجعتها وتأكيدها.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowPaymentModal(false)}
              >
                إلغاء
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmitPayment}
                disabled={submittingPayment || !selectedMethod || !transactionNumber.trim()}
              >
                {submittingPayment ? "جاري الإرسال..." : "تأكيد الدفع"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddProgramModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProgram}
      />
    </div>
  );
}

