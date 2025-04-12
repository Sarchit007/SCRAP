const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/scrap");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, 
    default: "", 
  },
  boards: {
    type: Array,
    default: [],
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  }]
});

// Enable password authentication (removes need for password field)
userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
