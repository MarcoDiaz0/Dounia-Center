import { Link } from 'react-router-dom'
import { Leaf, Check } from 'lucide-react'
import SignupForm from '@/components/auth/SignupForm'

const benefits = [
  'تقييم مجاني لاحتياجات طفلك',
  'ملف رقمي شخصي لمتابعة التقدم',
  'متابعة تقدم طفلك بسهولة',
  'الوصول إلى مكتبة الموارد التعليمية',
  'تقارير تقدم دورية',
]

export default function Signup() {
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
              <span className="font-bold text-xl text-primary-800">مركز دنيا</span>
              <span className="block text-sm text-primary-600">للنمو الداخلي والتعلم المتكامل</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-2">أنشئ حسابك</h1>
            <p className="text-primary-600">انضم إلينا وابدأ رحلة نمو طفلك</p>
          </div>

          {/* Form */}
          <SignupForm />
        </div>
      </div>

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-bl from-primary-500 to-primary-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-8">
            <Leaf className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلة طفلك معنا</h2>
          <p className="text-primary-100 leading-relaxed mb-8">
            أنشئ حسابك الآن للاستفادة من خدماتنا التربوية والإرشادية.
          </p>

          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-primary-100">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
