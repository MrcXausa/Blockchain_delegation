require('dotenv').config()

const app=require("./app")
const mongoose = require('mongoose')

var port = process.env.PORT || 8080;


var db = mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("Connected to Database"), 
    app.listen(port, () => { console.log(`Server listening`); })
}).catch(()=> {
    console.log("Database connection Error")
});