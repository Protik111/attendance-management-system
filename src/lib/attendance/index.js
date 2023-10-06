const Attendance = require("../../model/Attendance");
const { badRequest } = require("../../utils/error");

const createAttendance = async ({ date, event }) => {
  if (!date || !event) {
    throw badRequest("Invalid parameters");
  }

  const newEvents = { ...event };

  const attendance = new Attendance({ date, events: newEvents });

  await attendance.save();

  return { ...attendance._doc, id: attendance.id };
};

module.exports = {
  createAttendance,
};
