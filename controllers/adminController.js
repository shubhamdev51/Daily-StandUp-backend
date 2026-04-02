const Standup = require("../models/standup");
const User = require("../models/user");

exports.getUsers = async (req, res) => {
  try {
    const { date } = req.query;
    const result = await Standup.aggregate([
      {
        $match: { date: date }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          email: "$user.email",
          morningSubmitted: {
            $gt: ["$morning.submittedAt", null]
          },
          eveningSubmitted: {
            $gt: ["$evening.submittedAt", null]
          }
        }
      },
      {
        $group: {
          _id: null,
          morning: {
            $push: {
              $cond: [
                "$morningSubmitted",
                "$email",
                "$$REMOVE"
              ]
            }
          },
          evening: {
            $push: {
              $cond: [
                "$eveningSubmitted",
                "$email",
                "$$REMOVE"
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          morning: 1,
          evening: 1
        }
      }
    ]);
    res.json(result[0] || { morning: [], evening: [] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserMorReport = async (req, res) => {
  try {
    const { email, date } = req.query;
    // if (req.user.role !== "admin") {
    // return res.status(403).json({ message: "Access denied" });
    // }
    const user = await User.findOne({ email }).select("_id");
    const standup = await Standup.findOne({
      user: user._id,
      date: date,
    }).select("morning");
    res.json(standup.morning);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserEveReport = async (req, res) => {
  try {
    const { email, date } = req.query;
    // if (req.user.role !== "admin") {
    // return res.status(403).json({ message: "Access denied" });
    // }
    const user = await User.findOne({ email }).select("_id");
    const standup = await Standup.findOne({
      user: user._id,
      date: date,
    }).select("evening");
    res.json(standup.evening);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
