const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["todo", "in_progress", "done"],
    default: "todo",
  },
  dueDate: {
    type: Date,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "organizations",
    required: true,
  },
});

module.exports = mongoose.model("tasks", taskSchema);
