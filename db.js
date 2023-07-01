const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo =async () => {
    try{
        mongoose.connect(mongoURI)
        console.log("Successfully connected to mongodb")
    }catch(err){
        console.log("Failed to connect with mongodb", err);
    }
}
module.exports = connectToMongo;