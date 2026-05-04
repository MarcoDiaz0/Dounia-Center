export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-300 mb-4">404</h1>
        <p className="text-xl text-primary-700 mb-6">الصفحة غير موجودة</p>
        <a href="/" className="btn-primary">
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
}
