const attendanceService = require("../../../../lib/attendance");

const bulkUpdateAttendance = async (req, res, next) => {
  const file = req.file;
  //   console.log("req", req);
  try {
    const updatedAttendances = await attendanceService.bulkUpdate({ file });

    const response = {
      code: 200,
      message: "Attendance bulk updated successfully",
      //   data: { ...updatedAttendances },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = bulkUpdateAttendance;
