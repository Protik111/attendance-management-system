const attendanceService = require("../../../../lib/attendance");

const dayOff = async (req, res, next) => {
  console.log("req");
  const date = req.body;

  try {
    const attendance = await attendanceService.makeDayAsOff({
      date,
      user: req.user.id,
    });

    const response = {
      code: 200,
      message: "Marked as off successfully!",
      data: { ...attendance },
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = dayOff;
