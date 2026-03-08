const mongoose = require("mongoose");

const standupSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    morning: {
      project: String,
      yesterdayUpdate: String,
      todayDeliverables: String,
      blocker: String,
      blockerDescription: String,
      submittedAt: Date,
    },

    evening: {
      project: String,
      deliverablesStatus: String,
      todaysUpdate: String,
      completionTimeline: String,
      blockerDescription: String,
      submittedAt: Date,
    },
  },
  { timestamps: true }
);

standupSchema.index({ user: 1, date: 1 }, { unique: true });

const Standup = mongoose.model("Standup", standupSchema);
module.exports = Standup;