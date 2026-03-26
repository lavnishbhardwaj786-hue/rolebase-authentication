const mongoose = require("mongoose");


// const schema = new mongoose.Schema({...}, { timestamps: true }) create cretaed at evry wehere 
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
// objectId -unique id which mongoose automaticall generates
  description: {
    type: String
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  // ref populate me help kare jis se ye jo id ha wo poore schema me convert ho jaegeyi jaise user ko ref kr rahi ha to user ajayega us id ki jageh pe 
// ref it just tell which collection the id belongs to and through populate we can excess it as well and through ref we know which id is there to pick the data 
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: ["pending", "working", "complete"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);