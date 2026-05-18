import { useState, useEffect } from "react";
import { User, Lock, Settings, Save, Phone, Mail, Key, CreditCard, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { userService } from "@/services/userService";
import { settingsService } from "@/services/settingsService";

export default function DashboardSettings() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // System Payment Config State (Admin only)
  const [systemSettings, setSystemSettings] = useState({
    baridimob_rip: "",
    baridimob_name: "",
    redotpay_id: "",
  });

  // Fetch settings on mount or when tab changes to system
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        setSystemSettings({
          baridimob_rip: settings.baridimob_rip || "",
          baridimob_name: settings.baridimob_name || "",
          redotpay_id: settings.redotpay_id || "",
        });
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };

    fetchSettings();
  }, []);

  // Update profile form state when user store changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullName.trim()) {
      return toast.error("يرجى إدخال الاسم الكامل");
    }

    try {
      setIsLoading(true);
      const updatedUser = await userService.updateProfile(user.id, {
        fullName: profileData.fullName,
        phone: profileData.phone,
      });

      // Update authStore
      useAuthStore.setState({ user: updatedUser });
      toast.success("تم تحديث الملف الشخصي بنجاح");
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل تحديث الملف الشخصي");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      return toast.error("يرجى إدخال كلمة المرور الحالية");
    }
    if (passwordData.newPassword.length < 6) {
      return toast.error("يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل");
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("كلمة المرور الجديدة غير متطابقة");
    }

    try {
      setIsLoading(true);
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل تغيير كلمة المرور");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Admin Payment Configuration Update
  const handleSystemSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await settingsService.updateSettings(systemSettings);
      toast.success("تم حفظ إعدادات الدفع بنجاح");
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل حفظ إعدادات الدفع");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-primary-800">الإعدادات</h1>
        <p className="text-primary-600 mt-1">إدارة حسابك وتخصيص إعدادات النظام</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-secondary-200 gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "profile"
              ? "text-primary-600 font-semibold"
              : "text-primary-500 hover:text-primary-700"
          }`}
        >
          <User className="w-4 h-4" />
          <span>الملف الشخصي</span>
          {activeTab === "profile" && (
            <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
            activeTab === "security"
              ? "text-primary-600 font-semibold"
              : "text-primary-500 hover:text-primary-700"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>الأمان</span>
          {activeTab === "security" && (
            <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary-600 rounded-full" />
          )}
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
              activeTab === "system"
                ? "text-primary-600 font-semibold"
                : "text-primary-500 hover:text-primary-700"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات الدفع والنظام</span>
            {activeTab === "system" && (
              <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary-600 rounded-full" />
            )}
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
        {/* PANEL 1: PROFILE */}
        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary-800 mb-1">تفاصيل الحساب</h2>
              <p className="text-sm text-primary-600">تحديث معلومات حسابك الأساسية</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-primary-800"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-400">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-primary-800 text-right"
                    placeholder="رقم الهاتف"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full pr-10 pl-4 py-3 bg-secondary-100 border border-secondary-200 rounded-xl text-primary-400 cursor-not-allowed"
                    dir="ltr"
                  />
                </div>
                <p className="text-xs text-primary-500 mt-1">لا يمكن تغيير البريد الإلكتروني للحساب</p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </form>
        )}

        {/* PANEL 2: SECURITY */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary-800 mb-1">تغيير كلمة المرور</h2>
              <p className="text-sm text-primary-600">تأكد من اختيار كلمة مرور قوية لحماية حسابك</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-400">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-primary-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-400">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-primary-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-400">
                    <Key className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pr-10 pl-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-primary-800"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>تحديث كلمة المرور</span>
              </button>
            </div>
          </form>
        )}

        {/* PANEL 3: SYSTEM CONFIG (Admin only) */}
        {activeTab === "system" && isAdmin && (
          <form onSubmit={handleSystemSettingsSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-primary-800 mb-1">إعدادات الدفع والنظام</h2>
              <p className="text-sm text-primary-600">
                تحديث حسابات الدفع اليدوية التي يتم عرضها للأولياء عند حجز البرامج
              </p>
            </div>

            {/* BARIDI MOB */}
            <div className="bg-secondary-50 p-6 rounded-2xl border border-secondary-100 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-secondary-200">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-primary-800">حساب BaridiMob (بريد الجزائر)</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-primary-700 mb-2">
                    رقم الحساب الجاري RIP (20 رقم)
                  </label>
                  <input
                    type="text"
                    value={systemSettings.baridimob_rip}
                    onChange={(e) => setSystemSettings({ ...systemSettings, baridimob_rip: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-right text-sm text-primary-800"
                    placeholder="0079999900XXXXXXXXXX"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-primary-700 mb-2">
                    اسم صاحب الحساب كامل (اللقب والاسم)
                  </label>
                  <input
                    type="text"
                    value={systemSettings.baridimob_name}
                    onChange={(e) => setSystemSettings({ ...systemSettings, baridimob_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm text-primary-800"
                    placeholder="الاسم واللقب بالاتينية"
                  />
                </div>
              </div>
            </div>

            {/* REDOT PAY */}
            <div className="bg-secondary-50 p-6 rounded-2xl border border-secondary-100 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-secondary-200">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-primary-800">حساب RedotPay</h3>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary-700 mb-2">
                  معرف الحساب RedotPay Account ID
                </label>
                <input
                  type="text"
                  value={systemSettings.redotpay_id}
                  onChange={(e) => setSystemSettings({ ...systemSettings, redotpay_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-right text-sm text-primary-800"
                  placeholder="ID Account"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-soft hover:shadow-md transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>حفظ إعدادات النظام</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
