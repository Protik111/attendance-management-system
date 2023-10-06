const Attendance = require("../../model/Attendance");
const { badRequest } = require("../../utils/error");

const hasStarted = async (date) => {
  const event = await Attendance.findOne({ date: date });
  return event ? event : null;
};

const findEvent = async (id) => {
  const event = await Attendance.find({ "events._id": id });
  return event;
};

//create attendance for day and resume with event
const createAttendance = async ({ date, event, user }) => {
  if (!date || !event) {
    throw badRequest("Invalid parameters");
  }

  const startedForToday = await hasStarted(date);

  if (startedForToday) {
    startedForToday.events.push(event);
    await startedForToday.save();

    return { ...startedForToday._doc, id: startedForToday.id };
  } else {
    const newEvents = { ...event };
    const payload = {
      date,
      events: newEvents,
      user,
    };
    const attendance = new Attendance(payload);
    await attendance.save();

    return { ...attendance._doc, id: attendance.id };
  }
};

const stopAttendance = async ({ id }) => {
  if (!id) {
    throw badRequest("Invalid parameters!");
  }
  const event = await findEvent(id);

  if (!event) {
    badRequest("Attendance not found!");
  }

  const updatedEvent = await Attendance.findOneAndUpdate(
    { _id: event._id },
    // { $set: { "data.events.$[elem].isStopped": true } },
    {
      $set: {
        // "data.events.$[elem].title": "Updated Title",
        "events.$[inner].isStopped.": true,
      },
    },
    { new: true }
  );

  console.log("event", updatedEvent);
};

module.exports = {
  createAttendance,
  stopAttendance,
};
