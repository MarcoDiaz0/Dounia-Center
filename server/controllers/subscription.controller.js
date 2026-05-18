import Subscription from "../models/Subscription.model.js";
import Program from "../models/Program.model.js";
import Child from "../models/Child.model.js";
import User from "../models/User.model.js";
import Notification from "../models/Notification.model.js";

// @desc    Create a new subscription payment request
// @route   POST /api/subscriptions
// @access  Private
export const createSubscription = async (req, res) => {
  try {
    const { programId, paymentMethod, transactionNumber } = req.body;

    if (!programId || !paymentMethod || !transactionNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide programId, paymentMethod, and transactionNumber",
      });
    }

    // Verify program exists
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    // Create pending subscription
    const subscription = await Subscription.create({
      user: req.user.id,
      program: programId,
      paymentMethod,
      transactionNumber,
      status: "pending",
    });

    // Notify all admins about the new subscription payment request
    const admins = await User.find({ role: "admin" });
    const notificationPromises = admins.map((admin) =>
      Notification.create({
        recipient: admin._id,
        message: `تم تقديم طلب اشتراك جديد في برنامج "${program.name}" من قبل ${req.user.fullName}، بانتظار التحقق والموافقة.`,
        type: "subscription",
        relatedId: subscription._id,
      })
    );
    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: "Payment submission received and is pending admin approval",
      data: { subscription },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit payment request",
      error: error.message,
    });
  }
};

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private/Admin
export const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({})
      .populate("user", "fullName email phone")
      .populate("program", "name price duration")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { subscriptions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions",
      error: error.message,
    });
  }
};

// @desc    Get logged in user's subscriptions
// @route   GET /api/subscriptions/my
// @access  Private
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user.id })
      .populate("program", "name price duration icon category description features")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { subscriptions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your subscriptions",
      error: error.message,
    });
  }
};

// @desc    Update subscription status (Confirm/Reject)
// @route   PUT /api/subscriptions/:id/status
// @access  Private/Admin
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["confirmed", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    subscription.status = status;
    await subscription.save();

    // If confirmed, automatically enroll parent's children in this program
    if (status === "confirmed") {
      const children = await Child.find({ parent: subscription.user });
      for (const child of children) {
        if (!child.enrolledPrograms.includes(subscription.program)) {
          child.enrolledPrograms.push(subscription.program);
          await child.save();
        }
      }
    }

    // Populate user and program details to return
    await subscription.populate([
      { path: "user", select: "fullName email phone" },
      { path: "program", select: "name price duration" }
    ]);

    // Notify parent about the status change
    const messageText = status === "confirmed"
      ? `تم تأكيد وتفعيل اشتراكك في برنامج "${subscription.program.name}" بنجاح! يمكنك الآن الاستفادة من جميع مميزات البرنامج.`
      : `للأسف، تم رفض طلب اشتراكك في برنامج "${subscription.program.name}". يرجى التحقق من صحة رقم المعاملة وإعادة المحاولة.`;

    await Notification.create({
      recipient: subscription.user._id,
      message: messageText,
      type: "subscription",
      relatedId: subscription._id,
    });

    res.json({
      success: true,
      message: `Subscription status updated to ${status}`,
      data: { subscription },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update subscription status",
      error: error.message,
    });
  }
};
