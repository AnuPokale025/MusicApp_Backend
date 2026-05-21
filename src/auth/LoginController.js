const mongoose = require('mongoose');
const Admin = require('../modals/Admin');
const User = require('../modals/User');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const LoginController = async (req, res) => {

    try {

        const {
            email,
            username,
            password
        } = req.body || {};

        if ((!email && !username) || !password) {
            return res.status(400).send({
                message: "Email/Username and password are required"
            });
        }

        // Find Admin
        let account = await Admin.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        let role = "admin";

        // If admin not found, find user
        if (!account) {

            account = await User.findOne({
                $or: [
                    { email },
                    { username }
                ]
            });

            role = "user";
        }

        // Account not found
        if (!account) {
            return res.status(404).send({
                message: "Account not found"
            });
        }

        // Compare password
        const match = await bcrypt.compare(
            password,
            account.password
        );
        const accountdata = account.toObject();
        delete accountdata.password;

        const token = Jwt.sign(
            { account: accountdata, role },
            process.env.SECRET_KEY,
            { expiresIn: '2h' }
        );

        if (!match) {
            return res.status(400).send({
                message: "Invalid password"
            });
        }

        return res.status(200).send({
           account : accountdata,
           role,
           token
        });

    } catch (error) {

        console.error(error);

        return res.status(500).send({
            message: "Internal server error"
        });
    }
};
module.exports = { login: LoginController };