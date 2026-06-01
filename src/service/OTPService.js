// src/service/OTPService.js

const otpStore = new Map();

const OTP_EXPIRATION =
    Number(process.env.OTP_EXPIRATION) || 5 * 60 * 1000; // 5 minutes

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Save and send OTP
 */
const sendOTP = async (email) => {
    try {
        if (!email) {
            throw new Error("Email is required");
        }

        const otp = generateOTP();

        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + OTP_EXPIRATION,
        });

        // Integrate Nodemailer here
        console.log(`OTP for ${email}: ${otp}`);

        return {
            success: true,
            message: "OTP sent successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};

/**
 * Verify OTP
 */
const verifyOTP = async (email, otp) => {
    try {
        if (!email || !otp) {
            return {
                valid: false,
                message: "Email and OTP are required",
            };
        }

        const storedOTP = otpStore.get(email);

        if (!storedOTP) {
            return {
                valid: false,
                message: "OTP not found or expired",
            };
        }

        if (Date.now() > storedOTP.expiresAt) {
            otpStore.delete(email);

            return {
                valid: false,
                message: "OTP expired",
            };
        }

        if (storedOTP.otp !== otp) {
            return {
                valid: false,
                message: "Invalid OTP",
            };
        }

        // OTP verified successfully
        otpStore.delete(email);

        return {
            valid: true,
            message: "OTP verified successfully",
        };
    } catch (error) {
        return {
            valid: false,
            message: error.message,
        };
    }
};

/**
 * Remove expired OTPs every minute
 */
setInterval(() => {
    const now = Date.now();

    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
        }
    }
}, 60 * 1000);

module.exports = {
    generateOTP,
    sendOTP,
    verifyOTP,
};