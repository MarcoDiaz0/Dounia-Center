import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowLeft } from "lucide-react";
import Button from "../common/Button";
import { useAuthStore } from "@/store/authStore";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "parent",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      const msg = "كلمات المرور غير متطابقة";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setIsLoading(true);

      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      toast.success("تم إنشاء حسابك بنجاح! مرحباً بك.");
      navigate("/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "فشل إنشاء الحساب";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}


      {/* FULL NAME */}
      <div className="relative">
        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="input-base pr-12"
          placeholder="الاسم الكامل"
          required
        />
      </div>

      {/* EMAIL */}
      <div className="relative">
        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="input-base pr-12"
          placeholder="البريد الإلكتروني"
          required
        />
      </div>

      {/* PHONE */}
      <div className="relative">
        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input-base pr-12"
          placeholder="رقم الهاتف"
        />
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          className="input-base pr-12 pl-12"
          placeholder="كلمة المرور"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="relative">
        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-base pr-12"
          placeholder="تأكيد كلمة المرور"
          required
        />
      </div>

      <Button type="submit" loading={isLoading} className="w-full">
        إنشاء حساب
      </Button>

      <p className="text-center text-sm">
        لديك حساب؟ <Link to="/login">تسجيل الدخول</Link>
      </p>
    </form>
  );
}
