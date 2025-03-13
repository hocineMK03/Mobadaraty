const mongoose = require('mongoose');
const config = require('./config');
const mongoUrl = config.mongoUrl


const connectDB=async()=>{
   try{
    if(!mongoUrl){
        console.error('MongoDB connection error: Mongo URL not found');
        return;
    }
    const conn = await mongoose.connect(mongoUrl);
    if(conn){
        console.log('Connected to MongoDB database');
    }
    else{
        console.log('MongoDB connection error');
    }
   }
   catch(error){
         console.error('MongoDB connection error1:', error);
   }

}

module.exports={connectDB,mongoose};