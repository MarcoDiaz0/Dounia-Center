import Setting from "../models/Setting.model.js";

// Get all settings as a key-value dictionary map
export const getSettings = async (req, res) => {
  try {
    const settingsList = await Setting.find({});
    
    const data = {};
    settingsList.forEach((s) => {
      data[s.key] = s.value;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

// Update settings (bulk upsert)
export const updateSettings = async (req, res) => {
  try {
    const settingsObj = req.body;

    if (!settingsObj || typeof settingsObj !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid settings payload",
      });
    }

    const promises = Object.entries(settingsObj).map(([key, value]) => {
      return Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true, runValidators: true }
      );
    });

    await Promise.all(promises);

    // Fetch the updated settings to return to client
    const settingsList = await Setting.find({});
    const data = {};
    settingsList.forEach((s) => {
      data[s.key] = s.value;
    });

    res.json({
      success: true,
      message: "Settings updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings",
      error: error.message,
    });
  }
};
