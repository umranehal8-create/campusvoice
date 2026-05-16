const mongoose = require('mongoose')

async function connectDB() {
    await mongoose.connect(process.env.MONGOOSE_KEY);
    console.log("db connceted successfully");
}
module.exports = connectDB;