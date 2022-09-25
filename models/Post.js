// Skipping genres until I can figure out how user can input an array of genres (Fiction, Thiller, Romance, Comedy, Fantasty)
// Add bookmark/favorite to schema
// Add user rating to schema
// Books can have multiple authors... so that will need to be an array as well.
// Google Books API - Can add publisher, page count, published date. As it stands... the user will have to manually input the book description, author, genres. It would be brilliant if the user could input a book title, then the data for that would be pre-populate for them.

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  bookTitle: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookAuthor: {
    type: String,
    required: true,
  },
  genres: {
    type: String,
    required: true,
  },
  bookDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
