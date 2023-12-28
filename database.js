const mongoose = require("mongoose");
//require("dotenv").config();
/**
 * -------------- DATABASE ----------------
 */

// const conn = process.env.MONGO_URI;
// console.log(conn);

// const connection = mongoose.createConnection(
//   conn,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log("the connection with mongod is established");
//   }
// );

const userSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  fname: String,
  lname: String,
  email: String,
  companyName: String,
  companyId: String,
  userId: String,
  userHash: String,
  createdAt: Date,
  updatedAt: Date,
});

// const User = connection.model("User", UserSchema);
const User = mongoose.model("User", userSchema);

// Expose the connection
// module.exports = connection;
module.exports = User;
