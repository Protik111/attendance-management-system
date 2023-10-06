const userService = require("../../../../lib/user");

const approve = async (req, res, next) => {
  const id = req.params.id;

  try {
    const user = await userService.approve({ id });

    const response = {
      code: 200,
      message: "User approved successfully!",
      data: { ...user },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = approve;
