const mongoose = require('mongoose');
const chatHistorySchema = new mongoose.Schema({
    username: {
      type: String,
      required: true
    },
    messages: [{
      text: String,
      sender: {
        type: String,
        enum: ['user', 'bot']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  });
  
  const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
  
  module.exports = ChatHistory;
  