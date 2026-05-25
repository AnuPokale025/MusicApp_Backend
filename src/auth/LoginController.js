const mongoose = require("mongoose");
const Admin = require("../modals/Admin");
const User = require("../modals/User");
const Jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const LoginController = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body || {};

    // Validation
    if (!emailOrUsername || !password) {
      return res.status(400).send({
        success: false,
        message: "Email/Username and password are required",
      });
    }

    // Find Admin
    let account = await Admin.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    let role = "admin";

    // If admin not found then find user
    if (!account) {
      account = await User.findOne({
        $or: [
          { email: emailOrUsername },
          { username: emailOrUsername },
        ],
      });

      role = "user";
    }

    // Account not found
    if (!account) {
      return res.status(404).send({
        success: false,
        message: "Account not found",
      });
    }

    // Compare password
    const match = await bcrypt.compare(
      password,
      account.password
    );

    // Invalid password
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Remove password from response
    const accountdata = account.toObject();
    delete accountdata.password;

    // Generate token
    const token = Jwt.sign(
      {
        account: accountdata,
        role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    // Success response
    return res.status(200).send({
      success: true,
      message: "Login successful",
      account: accountdata,
      role,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { login: LoginController };