import Program from "../models/Program.model.js";

export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true });
    res.json({
      success: true,
      data: { programs },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch programs",
      error: error.message,
    });
  }
};

export const createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({
      success: true,
      data: { program },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create program",
      error: error.message,
    });
  }
};

export const updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    res.json({
      success: true,
      data: { program },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update program",
      error: error.message,
    });
  }
};

export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!program) {
      return res.status(404).json({ success: false, message: "Program not found" });
    }
    res.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete program",
      error: error.message,
    });
  }
};
