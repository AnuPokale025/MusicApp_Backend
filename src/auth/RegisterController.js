const User = require('../modals/User');
const Artist = require('../modals/Artist');
const bcrypt = require('bcrypt');

const RegisterController = async (req, res) => {

    try {
        const { username, email, name, password, role, phone } = req.body || {};

        if (!req.body || !username || !name || !email || !password || !role) {
            return res.status(400).json({ message: 'Missing required fields: username, email, password, and role are required.' });
        }

        const isUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        })

        if (isUser) {
            return res.status(400).send({ message: "User is already Exist" });
        }

        let savedUser;
        if (role === 'artist') {
            const artistdata = new Artist({
                username, email, password, phone, name

            });
            savedUser = await artistdata.save();
        }
        else if (role === 'user') {
            const userData = new User({
                username, email, password, phone, name
            });
            savedUser = await userData.save();
        }
        else {
            return res.status(400).send({ message: "Invalid role" });
        }

        let result = savedUser.toObject();
        delete result.password;

        res.status(201).send({
            result,
            role
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = { register: RegisterController };