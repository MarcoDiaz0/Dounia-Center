import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-primary-800">
                مركز دنيا
              </span>
              <span className="block text-sm text-primary-600">
                للنمو الداخلي والتعلم المتكامل
              </span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">
              مرحباً بعودتك
            </h1>
            <p className="text-primary-600">سجل الدخول للوصول إلى حسابك</p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-bl from-primary-500 to-primary-700 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Leaf className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">نرافقكم نحو نمو متوازن</h2>
          <p className="text-primary-100 leading-relaxed">
            سجل الدخول لمتابعة تقدم طفلك، حجز الجلسات، والوصول إلى جميع الموارد
            التعليمية.
          </p>
        </div>
      </div>
    </div>
  );
}
