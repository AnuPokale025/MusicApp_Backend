const Admin = require("../modals/Admin");
const User = require("../modals/User");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const LoginController = async (req, res) => {
  try {

    const { emailOrUsername, password } = req.body || {};

    console.log("Login Body:", req.body);

    // ================= Validation =================

    if (!emailOrUsername || !password) {
      return res.status(400).send({
        success: false,
        message: "Email/Username and password are required",
      });
    }

    // ================= Find Admin =================

    let account = await Admin.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    let role = "admin";

    // ================= Find User =================

    if (!account) {
      account = await User.findOne({
        $or: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      });

      role = "user";
    }

    // ================= Account Not Found =================

    if (!account) {
      return res.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    // ================= Check Password Exists =================

    if (!account.password) {
      return res.status(500).send({
        success: false,
        message: "Password not found in database",
      });
    }

    // ================= Compare Password =================

    const match = await bcrypt.compare(
      password,
      account.password
    );

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // ================= Remove Password =================

    const accountData = account.toObject();

    delete accountData.password;

    // ================= Check Secret Key =================

    if (!process.env.SECRET_KEY) {
      return res.status(500).send({
        success: false,
        message: "SECRET_KEY is missing in environment variables",
      });
    }

    // ================= Generate JWT =================

    const token = Jwt.sign(
      {
        id: accountData._id,
        role: role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    // ================= Success =================

    return res.status(200).send({
      success: true,
      message: "Login successful",
      account: accountData,
      role,
      token,
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { login: LoginController };