import mongoose from "mongoose";
const app = require("./app.js");
//import app from "./app.js";
//LKOFtbNWMdrUaJv6

const DB_HOST = "mongodb+srv://Vasylysa:LKOFtbNWMdrUaJv6@cluster0.xqqnczp.mongodb.net/my-contacts?retryWrites=true&w=majority";

console.log(process.env);

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    })
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })


