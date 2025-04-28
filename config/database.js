const mongoose = require("mongoose")
require("dotenv").config();
module.exports.dataConnect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("CONNECT SUCESS!")
        
    } catch (error) {
        console.log("CONNECT ERROR" , error)
    }
}