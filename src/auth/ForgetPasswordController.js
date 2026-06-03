const User = require("../modals/User");
const Artist = require("../modals/Artist");
const { sendOTP } = require("../service/OTPService");

const ForgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });
        let role = "User";

        if (!user) {
            user = await Artist.findOne({ email });
            role = "Artist";
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Email is not registered",
            });
        }

        const result = await sendOTP(email);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            email,
            role,
        });

    } catch (err) {
        console.error("Forget Password Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {

    forget: ForgetPassword,
};