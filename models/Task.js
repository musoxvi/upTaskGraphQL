const mongoose = require("mongoose");

const TasksSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  state: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Task", TasksSchema);
