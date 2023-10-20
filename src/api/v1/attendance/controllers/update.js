const attendanceService = require("../../../../lib/attendance");

const updateTime = async (req, res, next) => {
  const id = req.params.id;
  const date = req.body.date;

  try {
    const updatedAttendance = await attendanceService.updatTime({ id, date });

    const response = {
      code: 200,
      message: "Attendance updated successfully",
      data: { ...updatedAttendance },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = updateTime;
