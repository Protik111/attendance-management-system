const User = require("../../model/User");
const { badRequest } = require("../../utils/error");

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user ? user : false;
};

const userExist = async (email) => {
  const user = await findUserByEmail(email);
  return user ? true : false;
};

const createUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw badRequest("Invalid parameters");
  }

  const user = new User({ name, email, password });
  await user.save();

  return {
    ...user._doc,
    id: user.id,
  };
};

/**
 * Create a new user with the provided information.
 * Admin access only
 * @param {Object} userData - The data for creating a new user
 * @param {String} userData.name - The name of the user
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.password - The password of the user.
 * @returns {Promise<Object>} - A promise that resolves with the created user's data, including the generated id.
 * @throws {Error} Throws an error if any of the required parameters (name, email, password) are missing.
 */
const create = async ({
  name,
  email,
  password,
  role = "user",
  status = "pending",
}) => {
  if (!name || !email || !password) throw badRequest("Invalid parameters");

  const hasUser = await userExist(email);

  if (hasUser) {
    throw badRequest("User already exists");
  }

  const user = new User({ name, email, password, role, status });
  await user.save();

  return { ...user._doc, id: user.id };
};

module.exports = {
  findUserByEmail,
  userExist,
  createUser,
  create,
};
