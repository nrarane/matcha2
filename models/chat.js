var mongoose = require('mongoose');

var ChatSchema = mongoose.Schema({
	sender: {
		type: String,
	},
	reciever: {
		type: String
	},
	message: {
		type: [String]
	},
    msgDate: {
        type: Date,
        default: Date.now
    }


});

var Chat = module.exports = mongoose.model('Chat', ChatSchema);

module.exports.createChat = function(newChat, callback){

    newChat.save(callback);
}

module.exports.updateChat = function(messageId, chat, callback){
    var query = { messageId: messageId };
    var update = {
        $push: { message: chat.message }
    }
    Chat.findOneAndUpdate(query, update, callback);
}