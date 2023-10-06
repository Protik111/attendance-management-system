const { Schema, model } = require("mongoose");
const { getDayName } = require("../utils/getDay");
const today = new Date();

const attendanceModel = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    events: [
      {
        title: {
          type: String,
          default: `${getDayName(today.getDay())}'s - Job`,
        },
        startTime: {
          type: Date,
          required: true,
        },
      },
    ],
    isOff: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, id: true }
);

const Attendance = model("Attendance", attendanceModel);
module.exports = Attendance;
