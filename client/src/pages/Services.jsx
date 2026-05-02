import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  Brain,
  BookOpen,
  Users,
  Calendar,
  GraduationCap,
  Video,
  ClipboardCheck,
  ArrowLeft,
  Check,
  CreditCard,
  Smartphone,
  X,
} from 'lucide-react'
import Button from '@/components/common/Button'
import Card, { CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/common/Card'
import SectionTitle from '@/components/common/SectionTitle'

const services = [
  {
    id: 'therapy',
    icon: Heart,
    title: 'الدعم النفسي والإرشاد',
    description: 'جلسات نفسية فردية وجماعية مع أخصائيين نفسيين معتمدين',
    longDescription: 'نقدم جلسات دعم نفسي متخصصة للأطفال والمراهقين، تشمل العلاج السلوكي المعرفي، العلاج باللعب، وجلسات الإرشاد الأسري. يعمل فريقنا من الأخصائيين النفسيين المعتمدين على فهم احتياجات كل طفل وتقديم الدعم المناسب.',
    features: [
      'جلسات فردية مع أخصائي نفسي',
      'جلسات جماعية تفاعلية',
      'إرشاد أسري للأهل',
      'متابعة مستمرة',
    ],
    price: '3,500',
    duration: 'جلسة 45 دقيقة',
    color: 'bg-rose-100 text-rose-600',
  },
  {
    id: 'learning',
    icon: Brain,
    title: 'برنامج صعوبات التعلم',
    description: 'برنامج متخصص لعلاج صعوبات التعلم مثل عسر القراءة والحساب',
    longDescription: 'برنامج شامل يعالج مختلف صعوبات التعلم بما في ذلك عسر القراءة (Dyslexia)، عسر الكتابة (Dysgraphia)، وعسر الحساب (Dyscalculia). يتضمن البرنامج تقييماً شاملاً وخطة علاجية مخصصة.',
    features: [
      'تقييم شامل لصعوبات التعلم',
      'خطة علاجية فردية',
      'تمارين تفاعلية',
      'تقارير تقدم دورية',
    ],
    price: '15,000',
    duration: 'برنامج شهري',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'reading',
    icon: BookOpen,
    title: 'تحسين القراءة والكتابة',
    description: 'تدريب متخصص لتطوير مهارات القراءة والكتابة',
    longDescription: 'برنامج متكامل لتحسين مهارات القراءة والكتابة عند الأطفال. يشمل تدريبات على الوعي الصوتي، فهم القراءة، الكتابة الإبداعية، والإملاء.',
    features: [
      'تدريبات الوعي الصوتي',
      'تمارين فهم القراءة',
      'الكتابة الإبداعية',
      'تحسين الإملاء',
    ],
    price: '12,000',
    duration: 'برنامج شهري',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'parents',
    icon: Users,
    title: 'توجيه الأولياء',
    description: 'ورشات وجلسات إرشادية للأهل لدعم أطفالهم',
    longDescription: 'جلسات وورشات متخصصة للأهل لمساعدتهم على فهم احتياجات أطفالهم وكيفية دعمهم بشكل فعال في المنزل والمدرسة.',
    features: [
      'ورشات تربوية',
      'استشارات فردية',
      'مجموعات دعم الأهل',
      'موارد تعليمية',
    ],
    price: '2,500',
    duration: 'جلسة 60 دقيقة',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    id: 'followup',
    icon: Calendar,
    title: 'المتابعة المستمرة',
    description: 'برنامج متابعة طويل المدى لضمان استمرار التحسن',
    longDescription: 'برنامج متابعة شامل يتضمن جلسات دورية، تقييمات منتظمة، وتقارير تقدم مفصلة لضمان استمرار التحسن.',
    features: [
      'جلسات متابعة أسبوعية',
      'تقييمات دورية',
      'تقارير تقدم شهرية',
      'تواصل مستمر مع المدرسة',
    ],
    price: '8,000',
    duration: 'اشتراك شهري',
    color: 'bg-teal-100 text-teal-600',
  },
  {
    id: 'academic',
    icon: GraduationCap,
    title: 'الدعم الأكاديمي',
    description: 'دعم دراسي متخصص لتحسين الأداء الأكاديمي',
    longDescription: 'برنامج دعم أكاديمي شامل يشمل المساعدة في الواجبات، التحضير للامتحانات، وتطوير مهارات الدراسة الفعالة.',
    features: [
      'دعم في المواد الدراسية',
      'تقنيات الدراسة الفعالة',
      'التحضير للامتحانات',
      'تنظيم الوقت',
    ],
    price: '10,000',
    duration: 'برنامج شهري',
    color: 'bg-indigo-100 text-indigo-600',
  },
]

const paymentMethods = [
  { id: 'ccp', name: 'CCP', icon: CreditCard, description: 'الدفع عبر الحساب البريدي الجاري' },
  { id: 'baridimob', name: 'BaridiMob', icon: Smartphone, description: 'الدفع عبر تطبيق بريدي موب' },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleSelectService = (service) => {
    setSelectedService(service)
    setShowPaymentModal(true)
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-bl from-cream via-white to-secondary-100 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">
              خدماتنا المتخصصة
            </h1>
            <p className="text-lg text-primary-600 leading-relaxed">
              نقدم مجموعة متكاملة من الخدمات النفسية والتربوية المصممة خصيصاً لدعم نمو طفلك وتطوره
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-primary-600 mb-4">{service.longDescription}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-primary-700">
                        <Check className="w-4 h-4 text-primary-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="text-2xl font-bold text-primary-700">{service.price} <span className="text-sm font-normal">د.ج</span></p>
                      <p className="text-sm text-primary-500">{service.duration}</p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => handleSelectService(service)}>
                    احجز الآن
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                برنامج دعم نفسي وأكاديمي متخصص لتلاميذ البكالوريا. نساعدهم على التغلب على الضغط والقلق، وتحسين مهارات الدراسة والتحضير للامتحانات.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'جلسات دعم نفسي للتعامل مع القلق',
                  'تقنيات إدارة الضغط',
                  'استراتيجيات الدراسة الفعالة',
                  'التحضير للامتحانات',
                  'توجيه مهني وجامعي',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="secondary" size="lg" onClick={() => handleSelectService({
                id: 'bac',
                title: 'دعم تلاميذ الباكالوريا',
                price: '20,000',
                duration: 'برنامج شامل',
              })}>
                احجز الآن
              </Button>
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
              <p className="font-medium text-primary-800">{selectedService.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-primary-600">{selectedService.duration}</span>
                <span className="text-lg font-bold text-primary-700">{selectedService.price} د.ج</span>
              </div>
            </div>

            <p className="text-sm text-primary-600 mb-4">اختر طريقة الدفع:</p>

            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className="w-full flex items-center gap-4 p-4 border-2 border-secondary-200 rounded-xl hover:border-primary-400 transition-colors text-right"
                >
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <method.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-primary-800">{method.name}</p>
                    <p className="text-sm text-primary-600">{method.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-primary-500 text-center mb-4">
              * سيتم التواصل معك لتأكيد الحجز وتفاصيل الدفع
            </p>

            <Button className="w-full" onClick={() => setShowPaymentModal(false)}>
              تأكيد الحجز
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
