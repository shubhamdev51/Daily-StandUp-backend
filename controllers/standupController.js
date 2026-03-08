const Standup = require("../models/standup");

exports.submitMorning = async (req, res) => {
  try {
    const { project, yesterdayUpdate, todayDeliverables, blocker, blockerDescription } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    let standup = await Standup.findOne({ user: userId, date: today });
    if (standup && standup.morning && standup.morning.submittedAt) {
      return res.status(400).json({ message: "Morning standup already submitted for today" });
    }
    if (standup) {
      standup.morning = {
        project,
        yesterdayUpdate,
        todayDeliverables,
        blocker,
        blockerDescription,
        submittedAt: new Date(),
      };
    } 
    else {
      standup = new Standup({
        user: userId,
        date: today,
        morning: {
        project,
        yesterdayUpdate,
        todayDeliverables,
        blocker,
        blockerDescription,
        submittedAt: new Date(),
        },
      });
    }
    await standup.save();
    res.status(200).json({ message: "Morning standup submitted successfully"});
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitEvening = async (req, res) => {
  try {
    const { project, deliverablesStatus, todaysUpdate, completionTimeline, blockerDescription } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];
    let standup = await Standup.findOne({ user: userId, date: today });
    if (standup && standup.evening && standup.evening.submittedAt) {
      return res.status(400).json({
        message: "Evening standup already submitted for today",
      });
    }
    if (standup) {
      standup.evening = {
        project,
        deliverablesStatus,
        todaysUpdate,
        completionTimeline,
        blockerDescription,
        submittedAt: new Date(),
      };
    } 
    else {
      standup = new Standup({
        user: userId,
        date: today,
        evening: {
        project,
        deliverablesStatus,
        todaysUpdate,
        completionTimeline,
        blockerDescription,
        submittedAt: new Date(),
        },
      });
    }
    await standup.save();
    res.status(200).json({ message: "Evening standup submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};