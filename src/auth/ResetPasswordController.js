const User = require("../modals/User");
const Admin = require("../modals/Admin");

const { verifyOTP } = require("../service/OTPService");
const RegisterController = require("./RegisterController");

const Resetpassword = async (req, res) => {

    const {email, otp, newPassword}= req.body;

    const result  = await verifyOTP(email.otp);
    if(!res.valid){
        return res.status(400).send({message: result.message})
    };

    let user = await User.findOne({email})
    let role = 'User'

    if(!user){
        let user = await Admin.findOne({email})
        let role = 'Admin'
    }

    if(!user){
        return res.status(400).send({message: "User not Found"})
    }
    
    user.password = newPassword;
    await user.save();
    res.status(200).send({message : "password reset successfully"})

}

module.exports= {reset: Resetpassword}
