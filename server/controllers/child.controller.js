import Child from "../models/Child.model.js";
import Assessment from "../models/Assessment.model.js";
import Session from "../models/Session.model.js";
import Note from "../models/Note.model.js";
import Program from "../models/Program.model.js";
import User from "../models/User.model.js";
import Notification from "../models/Notification.model.js";

// ─────────────────────────────────────────
// CHILDREN CRUD
// ─────────────────────────────────────────

// Get all children for parent or all children for admin
export const getChildren = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? { isActive: true } : { parent: req.user.id, isActive: true };
    const children = await Child.find(query)
      .populate("parent", "fullName email")
      .populate("enrolledPrograms")
      .populate("assessments")
      .populate("sessions")
      .populate("notes")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { children },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch children",
      error: error.message,
    });
  }
};

// Get child by ID
export const getChildById = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id };
    const child = await Child.findOne(query)
      .populate("parent", "fullName email")
      .populate("enrolledPrograms")
      .populate("assessments")
      .populate("sessions")
      .populate("notes");

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    res.json({
      success: true,
      data: { child },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch child",
      error: error.message,
    });
  }
};

// Create new child profile
export const createChild = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      avatar,
      specialNeeds,
      allergies,
      medicalNotes,
    } = req.body;

    const child = await Child.create({
      parent: req.user.id,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      avatar,
      specialNeeds,
      allergies,
      medicalNotes,
    });

    // Notify admins
    const admins = await User.find({ role: "admin" });
    const notificationPromises = admins.map((admin) =>
      Notification.create({
        recipient: admin._id,
        message: `تمت إضافة طفل جديد: ${firstName} ${lastName} من قبل ${req.user.fullName}`,
        type: "child_added",
        relatedId: child._id,
      })
    );
    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: "Child profile created successfully",
      data: { child },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create child profile",
      error: error.message,
    });
  }
};

// Update child profile
export const updateChild = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      avatar,
      specialNeeds,
      allergies,
      medicalNotes,
      developmentalScores,
    } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (avatar) updateData.avatar = avatar;
    if (specialNeeds) updateData.specialNeeds = specialNeeds;
    if (allergies) updateData.allergies = allergies;
    if (medicalNotes !== undefined) updateData.medicalNotes = medicalNotes;
    if (developmentalScores)
      updateData.developmentalScores = developmentalScores;

    const child = await Child.findOneAndUpdate(
      (req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }),
      updateData,
      { new: true, runValidators: true },
    )
      .populate("enrolledPrograms")
      .populate("assessments")
      .populate("sessions")
      .populate("notes");

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    res.json({
      success: true,
      message: "Child profile updated successfully",
      data: { child },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update child profile",
      error: error.message,
    });
  }
};

// Delete child profile (soft delete)
export const deleteChild = async (req, res) => {
  try {
    const child = await Child.findOneAndUpdate(
      (req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }),
      { isActive: false },
      { new: true },
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    res.json({
      success: true,
      message: "Child profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete child profile",
      error: error.message,
    });
  }
};

// Add milestone to child
export const addMilestone = async (req, res) => {
  try {
    const { title, category, achievedAt, notes } = req.body;

    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    child.milestones.push({
      title,
      category,
      achievedAt: achievedAt || new Date(),
      notes,
    });

    await child.save();

    res.status(201).json({
      success: true,
      message: "Milestone added successfully",
      data: { child },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add milestone",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────
// PROGRAMS
// ─────────────────────────────────────────

// Enroll child in a program
export const enrollProgram = async (req, res) => {
  try {
    const { programId } = req.body;

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    if (child.enrolledPrograms.includes(programId)) {
      return res.status(400).json({
        success: false,
        message: "Child is already enrolled in this program",
      });
    }

    child.enrolledPrograms.push(programId);
    await child.save();
    await child.populate("enrolledPrograms");

    res.status(201).json({
      success: true,
      message: "Child enrolled in program successfully",
      data: { enrolledPrograms: child.enrolledPrograms },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to enroll in program",
      error: error.message,
    });
  }
};

// Unenroll child from a program
export const unenrollProgram = async (req, res) => {
  try {
    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    child.enrolledPrograms = child.enrolledPrograms.filter(
      (p) => p.toString() !== req.params.programId,
    );

    await child.save();

    res.json({
      success: true,
      message: "Child unenrolled from program successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unenroll from program",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────
// ASSESSMENTS
// ─────────────────────────────────────────

// Add assessment
export const addAssessment = async (req, res) => {
  try {
    const { date, type, results } = req.body;

    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    const assessment = await Assessment.create({
      child: child._id,
      date,
      type,
      results,
    });

    child.assessments.push(assessment._id);
    await child.save();

    res.status(201).json({
      success: true,
      message: "Assessment added successfully",
      data: { assessment },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add assessment",
      error: error.message,
    });
  }
};

// Delete assessment
export const deleteAssessment = async (req, res) => {
  try {
    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    await Assessment.findByIdAndDelete(req.params.assessmentId);

    child.assessments = child.assessments.filter(
      (a) => a.toString() !== req.params.assessmentId,
    );
    await child.save();

    res.json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete assessment",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────

// Add session
export const addSession = async (req, res) => {
  try {
    const { date, time, type, status } = req.body;

    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    const session = await Session.create({
      child: child._id,
      date,
      time,
      type,
      status,
    });

    child.sessions.push(session._id);
    await child.save();

    res.status(201).json({
      success: true,
      message: "Session added successfully",
      data: { session },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add session",
      error: error.message,
    });
  }
};

// Update session status
export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    const session = await Session.findByIdAndUpdate(
      req.params.sessionId,
      { status },
      { new: true, runValidators: true },
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      message: "Session status updated successfully",
      data: { session },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update session",
      error: error.message,
    });
  }
};

// Delete session
export const deleteSession = async (req, res) => {
  try {
    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    await Session.findByIdAndDelete(req.params.sessionId);

    child.sessions = child.sessions.filter(
      (s) => s.toString() !== req.params.sessionId,
    );
    await child.save();

    res.json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete session",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────
// NOTES
// ─────────────────────────────────────────

// Add note
export const addNote = async (req, res) => {
  try {
    const { content, date } = req.body;

    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    const note = await Note.create({
      child: child._id,
      content,
      date: date || new Date(),
    });

    child.notes.push(note._id);
    await child.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      data: { note },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message,
    });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const child = await Child.findOne(
      req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, parent: req.user.id }
    );

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    await Note.findByIdAndDelete(req.params.noteId);

    child.notes = child.notes.filter((n) => n.toString() !== req.params.noteId);
    await child.save();

    res.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};
