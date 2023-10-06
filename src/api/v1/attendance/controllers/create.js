const attendanceService = require("../../../../lib/attendance");

const create = async (req, res, next) => {
  const { date, event } = req.body;

  try {
    const attendance = await attendanceService.createAttendance({
      date,
      event,
      user: req.user.id,
    });

    const response = {
      code: 201,
      message: "Attendance created successfully",
      data: { ...attendance },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = create;
