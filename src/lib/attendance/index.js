const Attendance = require("../../model/Attendance");
const { badRequest } = require("../../utils/error");
const { getDayName } = require("../../utils/getDay");
const defaults = require("../../config/default");

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

//stop attedance for specific event
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

//make attendance as day off
const makeDayAsOff = async ({ date, user }) => {
  //creating a event title
  const today = new Date();
  const title = `${getDayName(today.getDay())} marked as Off day.`;

  //creating an attendance first
  const attendance = await createAttendance({
    date,
    evnt: title || "",
    user,
  });

  console.log("attendance", attendance);
};

/**
 * Find all attendances
 * Pagination
 * Searching
 * Sorting
 * @param{*} param0
 * @returns
 */
//view attendance by week and month
const viewAttendance = async ({
  page = defaults.page,
  limit = defaults.limit,
  sortType = defaults.sortType,
  sortBy = defaults.sortBy,
  searchByDate = defaults.searchByDate,
  sortParam = defaults.sortParam,
}) => {
  const sortStr = `${sortType === "dsc" ? "-" : ""}${sortBy}`;

  // const filter = {
  //   title: { $regex: search, $option: "i" },
  // };

  console.log("searchByDate", searchByDate);

  const dateToFind = { date: new Date(searchByDate()) };
  console.log("dateToFind", dateToFind);
  // "2023-09-20T12:34:56.789+00:00"

  const attendances = await Attendance.find()
    .sort(sortStr)
    .skip(limit * page - limit)
    .limit(limit);

  return attendances.map((attendance) => ({
    ...attendance._doc,
    id: attendance.id,
  }));
};

/**
 * Count all attendance
 * @param {*} param0
 * @returns
 */
const count = ({ search = "" }) => {
  const filter = {
    title: { $regex: search, $options: "i" },
  };

  return Attendance.count(filter);
};

module.exports = {
  createAttendance,
  stopAttendance,
  makeDayAsOff,
  viewAttendance,
  count,
};
