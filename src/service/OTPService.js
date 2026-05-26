const { v4: uuid } = require('uuid');


const otpstore = new Map();


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const sendOTP = async (email, otp) => {
    console.log(`OTP for ${email} : ${otp}`);

    otpstore.set(email, {
        otp,
        expiresAt: Date.now() + (parseInt(process.env.OTP_EXPIRATION) || 300000)
    });

    return true;

}

const verifyOTP = async (email, otp) => {
    const stored = otpstore.get(email);

    if (!stored) {
        return { valid: false, message: "OTP is not found or expired" }
    }

    if (Date.now() > stored.expiresAt) {
        otpstore.delete(email)
        return { valid: false, message: "OTP is expired" }
    } 

    
    if (stored.otp !== otp) {
        return { valid: false, message: "Invalid OTP" }
    }
    otpstore.delete(email);
    return { valid: true, message: "OTP verified succesfully" }
}
module.exports = { generateOTP, sendOTP, verifyOTP }