const mongoose = require("mongoose");
//contains user ids
const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
