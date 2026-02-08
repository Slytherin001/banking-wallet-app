import { userModel as User } from "../models/user.model.js";
import { generateToken, setCookies } from "../utils/generate.token.js";
import { decryptPassword } from "../utils/hash.password.js";

export const auth_login = async (req, resp) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return resp.status(400).json({
        success: false,
        message: "Username and password is required",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return resp.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatchPassword = await decryptPassword(password, user.password);
    if (!isMatchPassword) {
      return resp.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const generate_token = generateToken(user._id);
    if (!generate_token) {
      return resp.status(400).json({
        success: false,
        message: "Unable to generate the token",
      });
    }
    setCookies(resp, generate_token);
    resp.status(200).json({
      success: true,
      message: "Login Successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const auth_logout = async (req, resp) => {
  try {
    resp.clearCookie("token");
    resp.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return resp.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
