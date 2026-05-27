const User = require('../modals/User');
const Artist = require('../modals/Artist');
const {generateOTP,sendOTP} = require ('../service/OTPService')

const ForgetPassword = async(req, res)=>{

    try{
        const {email} = req.body;

        let user = await User.findOne({email})
        let role = 'User'

        if(!user){
            user = await Admin.findOne({email})
            role = 'Artist'
        }
        if(!user){
            return res.status(400).send({ message : "Email is not registered"})
        }

        const otp = generateOTP();
        await sendOTP(email, otp);
        // console.log(sendOTP);
        
        res.status(200).send({message : "OTP send succesfully", email})


    }catch(err){
        res.status(500).send({message: "Internal Server error"})
    }
    
}
module.exports= {forget: ForgetPassword}