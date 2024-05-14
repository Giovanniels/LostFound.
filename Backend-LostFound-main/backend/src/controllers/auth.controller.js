const { respondSuccess, respondError } = require("../utils/resHandler");
const AuthServices = require("../services/auth.service");

async function signIn(req, res) {
  try {
    const token = await AuthServices.signIn(req.body);
    token === null
      ? respondError(req, res, 404, "User not found")
      : respondSuccess(req, res, 200, { token });
  } catch (error) {
    respondError(req, res, 400, error.message);
  }
}

module.exports = {
  signIn,
};
