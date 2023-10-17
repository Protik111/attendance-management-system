const attendanceService = require("../../../../lib/attendance");
const defaults = require("../../../../config/default");

const viewAttendance = async (req, res, next) => {
  const page = req.query.page || defaults.page;
  const limit = req.query.limit || defaults.limit;
  const sortType = req.query.sort_type || defaults.sortType;
  const sortBy = req.query.sort_by || defaults.sortBy;
  const search = req.query.search || defaults.search;
  const sortParam = req.query.search || defaults.sortParam;

  try {
    const attendances = await attendanceService.viewAttendance({
      page,
      limit,
      sortType,
      sortBy,
      search,
      sortParam,
    });

    const response = {
      code: 200,
      message: "Attendance found successfully",
      data: { ...attendances },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = viewAttendance;
