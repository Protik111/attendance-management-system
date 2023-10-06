const attendanceService = require("../../../../lib/attendance");

const stop = async (req, res, next) => {
  const { id } = req.params;

  try {
    const attendance = await attendanceService.stopAttendance({ id });

    return res.status(200).json({
      attendance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = stop;
