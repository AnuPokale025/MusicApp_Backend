const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const artistSchema = new mongoose.Schema({
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
    },
    image: {
        type : String,
    }
},{timestamps:true});

artistSchema.pre('save',async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})


module.exports = mongoose.model('Artist', artistSchema);