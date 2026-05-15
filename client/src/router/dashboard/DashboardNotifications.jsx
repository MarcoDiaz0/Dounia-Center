import { useEffect } from "react";
import { Bell, Calendar, Users } from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";

export default function DashboardNotifications() {
  const { notifications, getNotifications, isLoading, markAsRead } =
    useNotificationStore();

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-800">الإشعارات</h1>

      {isLoading && (
        <div className="text-center py-20 text-primary-500">
          جاري التحميل...
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
          <p className="text-primary-600">لا توجد إشعارات جديدة</p>
        </div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => !notif.isRead && markAsRead(notif._id)}
              className={`bg-white p-4 rounded-2xl shadow-soft flex gap-4 items-start transition-all ${
                !notif.isRead ? "border-r-4 border-primary-500" : "opacity-70"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notif.type === "child_added"
                    ? "bg-primary-100 text-primary-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {notif.type === "child_added" ? (
                  <Users className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <p
                    className={`text-primary-800 ${!notif.isRead ? "font-bold" : ""}`}
                  >
                    {notif.message}
                  </p>
                  <span className="text-xs text-primary-400 shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
