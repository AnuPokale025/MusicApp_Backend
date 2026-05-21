const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        
    },
    email: {   
        type: String,
        unique: true
    },
    name:{
        type: String,
        
    },
    password:{
        type: String,
    
    },
    phone:{
        type: String,
    }
},{timestamps:true});

adminSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})
 

module.exports = mongoose.model('Admin', adminSchema);