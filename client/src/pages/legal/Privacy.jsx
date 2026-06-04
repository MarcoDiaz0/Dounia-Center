export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-3xl shadow-soft p-8 md:p-12 space-y-6">
          <h1 className="text-3xl font-bold text-primary-800">سياسة الخصوصية</h1>
          <p className="text-primary-600 leading-relaxed">
            يلتزم مركز دنيا بحماية خصوصية المستخدمين والبيانات الشخصية التي يتم
            جمعها من خلال الموقع والخدمات الرقمية.
          </p>
          <section className="space-y-3 text-primary-700 leading-relaxed">
            <h2 className="text-xl font-semibold text-primary-800">البيانات التي نجمعها</h2>
            <p>
              قد نقوم بجمع بيانات مثل الاسم، البريد الإلكتروني، رقم الهاتف،
              وبيانات مرتبطة بحساب المستخدم وطلبات الاشتراك والتقييمات.
            </p>
          </section>
          <section className="space-y-3 text-primary-700 leading-relaxed">
            <h2 className="text-xl font-semibold text-primary-800">كيفية استخدام البيانات</h2>
            <p>
              تُستخدم البيانات لتقديم الخدمات، تحسين تجربة المستخدم، متابعة
              الطلبات، والتواصل مع أولياء الأمور والمستخدمين بخصوص البرامج
              والتقييمات.
            </p>
          </section>
          <section className="space-y-3 text-primary-700 leading-relaxed">
            <h2 className="text-xl font-semibold text-primary-800">مشاركة البيانات</h2>
            <p>
              لا نقوم ببيع البيانات الشخصية. قد تُستخدم بعض الخدمات التقنية
              المساندة فقط عند الحاجة لتشغيل المنصة أو تقديم الخدمة.
            </p>
          </section>
          <section className="space-y-3 text-primary-700 leading-relaxed">
            <h2 className="text-xl font-semibold text-primary-800">التواصل</h2>
            <p>
              للاستفسارات المتعلقة بالخصوصية يمكنكم التواصل عبر البريد:
              <span className="font-medium"> dounia.center0@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
