import Session from "../models/Session.model.js";
import Subscription from "../models/Subscription.model.js";
import Program from "../models/Program.model.js";
import User from "../models/User.model.js";
import Notification from "../models/Notification.model.js";

// @desc    Reserve a session
// @route   POST /api/sessions
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { programId, phone, message } = req.body;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: "يرجى تحديد البرنامج المطلوب للحجز",
      });
    }

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "رقم الهاتف مطلوب لإتمام الحجز",
      });
    }

    // Verify program exists
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "البرنامج غير موجود",
      });
    }

    // Verify parent has confirmed subscription to the program
    const subscription = await Subscription.findOne({
      user: req.user.id,
      program: programId,
      status: "confirmed",
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "يجب عليك شراء هذا البرنامج أولاً لتتمكن من حجز حصة",
      });
    }

    // If user doesn't have a phone in profile, update it
    const user = await User.findById(req.user.id);
    if (user && (!user.phone || user.phone.trim() === "")) {
      user.phone = phone.trim();
      await user.save();
    }

    // Create session reservation
    const session = await Session.create({
      parent: req.user.id,
      program: programId,
      phone: phone.trim(),
      message: message || "",
      status: "pending",
    });

    // Notify all admin users about new session reservation request
    const admins = await User.find({ role: "admin" });
    const notificationPromises = admins.map((admin) =>
      Notification.create({
        recipient: admin._id,
        message: `تم حجز حصة جديدة لبرنامج "${program.name}" من قبل الولي ${req.user.fullName}. رقم الهاتف: ${phone}.`,
        type: "session",
        relatedId: session._id,
      })
    );
    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: "تم إرسال طلب حجز الحصة بنجاح، وهو بانتظار موافقة الإدارة",
      data: { session },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "فشل في إرسال طلب الحجز",
      error: error.message,
    });
  }
};

// @desc    Get logged in user's sessions
// @route   GET /api/sessions/my
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({ parent: req.user.id })
      .populate("program", "name category description")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "فشل في جلب الحصص الخاصة بك",
      error: error.message,
    });
  }
};

// @desc    Get all session reservations
// @route   GET /api/sessions
// @access  Private/Admin
export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find({})
      .populate("parent", "fullName email phone")
      .populate("program", "name price category")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { sessions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "فشل في جلب طلبات الحجز",
      error: error.message,
    });
  }
};

// @desc    Respond to session reservation (accept/reject, set time/where/notes)
// @route   PUT /api/sessions/:id/respond
// @access  Private/Admin
export const respondToSession = async (req, res) => {
  try {
    const { status, time, where, adminNotes } = req.body;

    if (!["confirmed", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "حالة الحجز غير صالحة",
      });
    }

    const session = await Session.findById(req.params.id)
      .populate("program", "name")
      .populate("parent", "fullName");
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "طلب الحجز غير موجود",
      });
    }


    if (status === "confirmed" && (!time || !where)) {
      return res.status(400).json({
        success: false,
        message: "يجب تحديد الوقت والمكان/الرابط لتأكيد الحصة",
      });
    }

    session.status = status;
    session.time = time || "";
    session.where = where || "";
    session.adminNotes = adminNotes || "";
    await session.save();

    // Create notification message for the parent
    let messageText = "";
    if (status === "confirmed") {
      messageText = `تم قبول حجز حصتك لبرنامج "${session.program.name}". الموعد: ${time}. المكان/الرابط: ${where}.`;
      if (adminNotes) {
        messageText += ` ملاحظة: ${adminNotes}`;
      }
    } else if (status === "rejected") {
      messageText = `للأسف، تم رفض طلب حجز حصتك لبرنامج "${session.program.name}".`;
      if (adminNotes) {
        messageText += ` السبب: ${adminNotes}`;
      }
    } else {
      messageText = `طلب حجز حصتك لبرنامج "${session.program.name}" عاد إلى قائمة الانتظار.`;
    }

    await Notification.create({
      recipient: session.parent._id,
      message: messageText,
      type: "session",
      relatedId: session._id,
    });

    res.json({
      success: true,
      message: "تم تحديث حالة الحجز وإخطار الولي",
      data: { session },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "فشل في تحديث حالة الحجز",
      error: error.message,
    });
  }
};
