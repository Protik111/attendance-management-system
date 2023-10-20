const attendanceService = require("../../../../lib/attendance");

const deleteAttendance = async (req, res, next) => {
  const { id } = req.params;

  try {
    await attendanceService.deleteAttendance({ id });

    const response = {
      code: 200,
      message: "Attendance deleted successfully",
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = deleteAttendance;
