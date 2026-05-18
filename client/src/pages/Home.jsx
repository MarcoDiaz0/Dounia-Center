import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  BookOpen,
  Heart,
  Users,
  ClipboardCheck,
  Sparkles,
  Shield,
  Award,
  ChevronLeft,
  Star,
  Quote,
  GraduationCap,
} from "lucide-react";
import Button from "@/components/common/Button";
import Card, { CardContent } from "@/components/common/Card";
import SectionTitle from "@/components/common/SectionTitle";
import { useAuthStore } from "@/store/authStore";
import { programService } from "@/services/programService";

const iconMap = {
  Heart,
  Brain,
  BookOpen,
  Users,
  Calendar: ArrowLeft, // Fallback
  GraduationCap,
};

// Journey steps
const journeySteps = [
  {
    step: 1,
    title: "التقييم الأولي",
    description: "تقييم شامل لتحديد احتياجات طفلك",
  },
  {
    step: 2,
    title: "التشخيص",
    description: "تحليل دقيق للنتائج وتحديد الاحتياجات",
  },
  { step: 3, title: "البرنامج المخصص", description: "وضع خطة علاجية مناسبة" },
  { step: 4, title: "المتابعة", description: "جلسات منتظمة ومتابعة مستمرة" },
  {
    step: 5,
    title: "النتائج والنمو",
    description: "تحقيق التطور والتحسن المستمر",
  },
];

// Testimonials
const testimonials = [
  {
    name: "سارة بن علي",
    role: "أم لطفل يبلغ 7 سنوات",
    content:
      "مركز دنيا غير حياة ابني بشكل كامل. الفريق محترف ومتفهم، وابني الآن يحب القراءة والمدرسة.",
    rating: 5,
  },
  {
    name: "أحمد مرابط",
    role: "أب لطفلين",
    content:
      "أنصح كل الأهالي بهذا المركز. البرنامج كان فعالاً جداً وساعد ابنتي على تجاوز صعوبات التركيز.",
    rating: 5,
  },
  {
    name: "فاطمة الزهراء",
    role: "أم لطفلة تبلغ 9 سنوات",
    content:
      "الدعم النفسي الذي حصلت عليه ابنتي كان رائعاً. شكراً لفريق دنيا على كل ما قدموه لنا.",
    rating: 5,
  },
];

// Why choose us
const features = [
  {
    icon: Shield,
    title: "برامج تعليمية",
    description: "خطط تعليمية وتربوية مدروسة بعناية",
  },
  {
    icon: Sparkles,
    title: "برامج مخصصة",
    description: "خطط علاجية تناسب كل طفل",
  },
  {
    icon: Award,
    title: "نتائج مثبتة",
    description: "سجل حافل بالنجاحات والتحسن",
  },
  {
    icon: Heart,
    title: "بيئة آمنة",
    description: "جو ترحيبي وداعم للأطفال والعائلات",
  },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await programService.getPrograms();
        setServices(data.slice(0, 4)); // Show first 4
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-bl from-cream via-white to-secondary-100">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/50 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>مركز متكامل في الدعم النفسي والتربوي</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 leading-tight mb-6">
                مركز دنيا
                <span className="block text-primary-600">
                  للنمو الداخلي والتعلم المتكامل
                </span>
              </h1>

              <p className="text-xl text-primary-700 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                نرافقكم نحو نمو نفسي وتعليمي متوازن. نقدم خدمات شاملة للأطفال
                والعائلات من خلال برامج تعليمية مدروسة.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/assessment">
                  <Button size="lg" icon={ClipboardCheck}>
                    ابدأ التقييم المجاني
                  </Button>
                </Link>
                <Link to="/services">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={ArrowLeft}
                    iconPosition="end"
                  >
                    تعرف على خدماتنا
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-secondary-200">
                <div className="text-center lg:text-right">
                  <p className="text-3xl font-bold text-primary-600">+500</p>
                  <p className="text-sm text-primary-700">عائلة سعيدة</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-3xl font-bold text-primary-600">+15</p>
                  <p className="text-sm text-primary-700">برنامج تعليمي</p>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-3xl font-bold text-primary-600">+5</p>
                  <p className="text-sm text-primary-700">سنوات خبرة</p>
                </div>
              </div>
            </div>

            {/* Hero Illustration */}
            <div className="relative animate-slide-up animate-delay-200 hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl rotate-6 opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl -rotate-3" />
                <div className="relative bg-white rounded-3xl shadow-card p-12 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-6">
                      <Heart className="w-16 h-16 text-primary-500" />
                    </div>
                    <p className="text-2xl font-bold text-primary-800 mb-2">
                      نمو متوازن
                    </p>
                    <p className="text-primary-600">نفسياً وتعليمياً</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="aspect-[4/3] bg-secondary-100 rounded-3xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100">
                    <div className="text-center p-8">
                      <BookOpen className="w-24 h-24 text-primary-400 mx-auto mb-4" />
                      <p className="text-primary-600 font-medium">
                        برامج تعليمية وتربوية مدروسة
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-800">+500</p>
                      <p className="text-sm text-primary-600">حالة ناجحة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionTitle
                title="من نحن"
                subtitle="مركز متكامل في تقديم الدعم النفسي والتربوي للأطفال والعائلات"
                align="right"
              />
              <div className="space-y-4 text-primary-700 leading-relaxed">
                <p>
                  مركز دنيا للنمو الداخلي والتعلم هو مؤسسة رائدة تقدم خدمات
                  نفسية وتربوية عالية الجودة للأطفال والعائلات في الجزائر.
                </p>
                <p>
                  نؤمن بأن كل طفل فريد من نوعه ويستحق الدعم المناسب لتحقيق
                  إمكاناته الكاملة. يعمل مركزنا جنباً إلى جنب مع العائلات لتوفير
                  بيئة داعمة ومحفزة.
                </p>
                <p>
                  نقدم برامج متنوعة تشمل الدعم النفسي، علاج صعوبات التعلم،
                  وتحسين المهارات الأكاديمية، مع التركيز على النهج الشخصي لكل
                  حالة.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/services">
                  <Button icon={ArrowLeft} iconPosition="end">
                    اكتشف خدماتنا
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-cream">
        <div className="container-custom">
          <SectionTitle
            title="خدماتنا"
            subtitle="نقدم مجموعة متكاملة من الخدمات التربوية لدعم نمو طفلك"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon] || BookOpen;
              return (
                <Card key={index} hover className="group">
                  <CardContent>
                    <div
                      className={`w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary-800 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-primary-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700 group"
                    >
                      <span>المزيد</span>
                      <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="end">
                عرض جميع الخدمات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Child Journey Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionTitle
            title="رحلة طفلك معنا"
            subtitle="خطوات منهجية نحو النمو والتطور"
          />

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-secondary-200 -translate-y-1/2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {journeySteps.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-primary-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-primary-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/assessment">
              <Button size="lg" icon={ClipboardCheck}>
                ابدأ رحلة طفلك الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-primary-900 text-white">
        <div className="container-custom">
          <SectionTitle
            title="لماذا تختار مركز دنيا؟"
            subtitle="نحن ملتزمون بتقديم أفضل دعم لطفلك وعائلتك"
            className="text-white [&_h2]:text-white [&_p]:text-primary-200 [&_div]:bg-primary-400"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover:bg-white/20 transition-colors"
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-200" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-primary-200 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-cream">
        <div className="container-custom">
          <SectionTitle
            title="ماذا يقول الأهالي"
            subtitle="تجارب حقيقية من عائلات ثقت بنا"
          />

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent>
                  <Quote className="w-10 h-10 text-primary-200 mb-4" />
                  <p className="text-primary-700 leading-relaxed mb-6">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-primary-800">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-primary-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bac Support Banner */}
      <section className="py-12 bg-gradient-to-l from-primary-600 to-primary-700">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  دعم تلاميذ الباكالوريا
                </h3>
                <p className="text-primary-100">
                  دعم نفسي وأكاديمي شامل لتلاميذ البكالوريا
                </p>
              </div>
            </div>
            {!isAdmin && (
              <Link to="/services">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={ArrowLeft}
                  iconPosition="end"
                >
                  اكتشف البرنامج
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
              هل طفلك يحتاج دعماً؟
            </h2>
            <p className="text-lg text-primary-600 mb-8">
              ابدأ بتقييم مجاني واكتشف كيف يمكننا مساعدة طفلك على النمو والتطور
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/assessment">
                <Button size="lg" icon={ClipboardCheck}>
                  ابدأ التقييم المجاني
                </Button>
              </Link>
              <Link to="/#contact">
                <Button variant="outline" size="lg">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
