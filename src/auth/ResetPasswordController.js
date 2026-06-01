const User = require("../modals/User");
const Artist = require("../modals/Artist");
const bcrypt = require("bcrypt");

const { verifyOTP } = require("../service/OTPService");

const ResetPassword =  async(req, res)=>{
  try{
    const {email,otp, newPassword} = req.body;

    const result = await verifyOTP(email, otp);
    if(!result.valid){
      return res.status(400).send({message : result.message})
    }

    let user = await User.findOne({email})
    let Model = User;

    if(!user){
      user = await Artist.findOne({email})
      Model = Artist;
    }

    if(!user){
      return res.status(400).send({message :" User not found" })
    }
    
    user.password = newPassword;
    await user.save();
    res.send({ message : "password reset succefully"})


  }catch(error){
    return res.status(500).send({result : "Something went wrong"})
  }
};

module.exports = {
  reset: ResetPassword,
};