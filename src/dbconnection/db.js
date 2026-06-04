const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = async()=>{
    await mongoose.connect(process.env.MONGO_URL).then(()=>{
        console.log("MongoDb is connected");
        
    }).catch((error)=>{
        console.error("Error connecting to MongoDB:", error);
    });
}
module.exports = connectDb;