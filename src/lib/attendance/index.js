const Attendance = require("../../model/Attendance");
const { badRequest } = require("../../utils/error");

const hasStarted = async (date) => {
  const event = await Attendance.findOne({ date: date });
  return event ? event : null;
};

const findEvent = async (id) => {
  const event = await Attendance.findOne({ "events._id": id });

  return event;

  // if (event && event.events && event.events.length > 0) {
  //   const desiredObject = event.events.find((event) => event._id == id);
  //   if (desiredObject) {
  //     return desiredObject;
  //   } else {
  //     console.log("Object not found.");
  //   }
  // } else {
  //   console.log("Object not found.");
  // }
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

  // console.log("event", event);

  const date = new Date();

  if (event && event.events && event.events.length > 0) {
    const desiredObject = event.events.find((event) => event._id == id);
    if (desiredObject) {
      // return desiredObject;
      desiredObject.isStopped = true;
      desiredObject.endTime = date.toISOString();
    } else {
      badRequest("Event not found!");
    }
  }

  await event.save();

  return { ...event._doc, id: event.id };
};

module.exports = {
  createAttendance,
  stopAttendance,
};
