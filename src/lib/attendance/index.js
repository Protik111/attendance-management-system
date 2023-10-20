const csv = require("csv-parser");
const fs = require("fs");
const Attendance = require("../../model/Attendance");
const { badRequest, serverError } = require("../../utils/error");
const { getDayName } = require("../../utils/getDay");
const defaults = require("../../config/default");

/**
 * This function checks is the attendance started or not
 * @param {Date} date - date in each attendance
 * @returns {Object} event -
 */
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

  // const dateToFind = { date: new Date(searchByDate) };
  // "2023-09-20T12:34:56.789+00:00"

  /**
   * This filter is for finding the attendances by date, lastWeek, lastMonth and then month name
   */
  const filter = {};
  if (searchByDate) {
    filter.date = searchByDate;
  } else if (searchByDate === "lastWeek") {
    const lastWeekStartDate = new Date();
    lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7);
    filter.date = { $gte: lastWeekStartDate, $lte: new Date() };
  } else if (searchByDate === "lastMonth") {
    const lastMonthStartDate = new Date();
    lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1);
    const currentMonthEndDate = new Date();
    currentMonthEndDate.setDate(0); // Sets the day to 0, which rolls back to the last day of the previous month
    filter.date = { $gte: lastMonthStartDate, $lte: currentMonthEndDate };
  } else if (
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].includes(sortParam)
  ) {
    // Filter by the month of the date
    filter.date = {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      $lte: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    };
  }

  const attendances = await Attendance.find(filter)
    .sort(sortStr)
    .skip(limit * page - limit)
    .limit(limit);

  return attendances.map((attendance) => ({
    ...attendance._doc,
    id: attendance.id,
  }));
};

//update time
const updatTime = async ({ id, date }) => {
  if (!id) {
    throw badRequest("Invalid parameters!");
  }

  const attendance = await Attendance.findById(id);
  if (!attendance) {
    throw badRequest("Attendance not found.");
  }

  attendance.date = date;

  await attendance.save();

  return { ...attendance._doc, id: attendance.id };
};

//delete attendance
const deleteAttendance = async ({ id }) => {
  if (!id) {
    throw badRequest("Invalid parameters!");
  }

  const attendance = await Attendance.findByIdAndDelete(id);
  if (!attendance) {
    throw badRequest("Attendance not found.");
  }
};

//bulk update with csv
const bulkUpdate = async ({ file }) => {
  if (!file) {
    throw badRequest("No file uploaded.");
  }

  const results = [];
  fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (let row of results) {
          const filter = {};
          if (row.id) {
            filter._id = row.id;
          }
          if (row.dateToFind) {
            filter.date = row.dateToFind;
          }

          const update = {
            $set: {
              // Update specific fields with data from the CSV row
              date: row.date,
              // Add more fields to update as needed
            },
          };

          const attendances = await Attendance.updateOne(filter, update);
          console.log("attendances", attendances);
        }
      } catch (error) {
        console.log("err", error);
        throw serverError("Server error occurred.");
      }
    });
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
  updatTime,
  deleteAttendance,
  bulkUpdate,
};
