const Standup = require("../models/standup");

exports.submitMorning = async (req, res) => {
  try {
    const { project, yesterdayUpdate, todayDeliverables, blocker, blockerDescription,comments, date, time } = req.body;
    const userId = req.user.id;
    const standup = await Standup.findOneAndUpdate(
      { user: userId, date: date }, 
      {
        $set: {
          time: time,
          morning: {
            project,
            yesterdayUpdate,
            todayDeliverables,
            blocker,
            blockerDescription,
            comments,
            submittedAt: new Date(),
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      message: "Morning standup saved successfully",
      data: standup,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error submitting morning standup",
    });
  }
};

exports.submitEvening = async (req, res) => {
  try {
    const { project, deliverablesStatus, todaysUpdate, completionTimeline, blockerDescription,comments, date, time } = req.body;
    const userId = req.user.id;
    const standup = await Standup.findOneAndUpdate(
      { user: userId, date: date }, 
      {
        $set: {
          time: time,
          evening: {
            project,
            deliverablesStatus,
            todaysUpdate,
            completionTimeline,
            blockerDescription,
            comments,
            submittedAt: new Date(),
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    return res.status(200).json({
      message: "Evening standup saved successfully",
      data: standup,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error submitting morning standup",
    });
  }
};

exports.standupStatus = async (req, res) => {
  try {
    const { date, user } = req.query;
    const status = await Standup.findOne({
          user: user,
          date: date
        });
    return res.status(200).json({
      standup: {
        morningSubmitted: !!status?.morning?.submittedAt,
        eveningSubmitted: !!status?.evening?.submittedAt,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Unable to fetch standup status"});
  }
};