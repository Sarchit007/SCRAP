const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  description: String,
  image: String,
 
});

// Enable password authentication (removes need for password field)


module.exports = mongoose.model("post", postSchema);
