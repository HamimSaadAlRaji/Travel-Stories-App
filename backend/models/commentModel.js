const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Reply schema (embedded in Comment)
const replySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Comment schema
const commentSchema = new Schema({
  storyId: {
    type: Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
