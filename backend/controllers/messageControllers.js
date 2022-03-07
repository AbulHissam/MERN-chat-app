const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const createMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) throw new Error("content or chatId is missing");

    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    const createdMessage = await Message.create(newMessage);

    // populate sender with appropriate user doc
    // populate chat with appropriate chat doc
    let message = await Message.findOne({
      _id: createdMessage._id,
    })
      .populate("sender", "name pic")
      .populate("chat");

    // refer message model
    // message.chat -> refers to a chat doc in chats collection
    // chat document has users array with users involved in chat and we should populate it to get user details
    message = await message.populate({
      path: "chat.users",
      select: "name pic email",
    });

    // update the chat with the created message as latestMessage
    // refer chatModel
    await Chat.findByIdAndUpdate({ _id: chatId }, { latestMessage: message });

    // send response
    res.status(200).json(message);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const fetchMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;

    let messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "name email pic")
      .populate("chat");

    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

module.exports = { createMessage, fetchMessages };
