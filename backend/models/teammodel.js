const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,// 
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      role: {
        type: String,
        enum: ["leader", "coLeader", "member"],
        default: "member"
      },

      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Team", teamSchema)