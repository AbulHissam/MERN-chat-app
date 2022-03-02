const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChats = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("userId is not present");
    }

    // Whenever in the schema of one collection we provide a reference (in any field) to a document from any other collection, we need a populate() method to fill the field with that document.
    // https://www.geeksforgeeks.org/mongoose-populate-method/

    // find chats where it is not a group chat and chats between user from req.body(userId) and current user(req.user._id->this is set after verifying token,refer middleware/authMiddleware)
    // users is an array in chatModel which will have the _id(foreign key to userModel) of the users involved in chat.populate() method will fill users array with user documents corresponding to those _id in the users array excluding "password" field form user document.
    // latestMessage will have _id refering to a message.populate() method is to populate latestMessage with the message document it is refering to
    //  refer chatModel
    let findChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // this to populate sender field in latestMessage.sender(message) with user document for the found chats
    // refer messageModel
    findChat = await User.populate(findChat, {
      path: "latestMessage.sender",
      select: "name email pic",
    });

    // if we find chat is not empty send it, else create new chat
    if (findChat.length !== 0) {
      // anyhow we will be having only one chat
      res.status(200).send(findChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      // create chat
      const createdChat = await Chat.create(chatData);
      // populate created chat with user documents
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    }
  } catch (err) {
    next(err);
    res.status(400).json({
      error: err.message,
    });
  }
};

const fetchChats = async (req, res, next) => {
  try {
    // find all chats where req.user._id is involved and populate the user,message documents where required
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // populate user documents for latestMessage.sender
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email pic",
    });
    // send response
    res.status(200).send(chats);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const createGroupChat = async (req, res, next) => {
  try {
    const { chatName, users } = req.body;

    if (!chatName || !users) {
      throw new Error("chatName or users is missing");
    }

    if (users.length < 2) {
      throw new Error("More than 2 users required for groupchat");
    }

    // push the current user also to users list
    users.push(req.user._id);

    const groupChatData = {
      chatName,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    };
    const createdGroupChat = await Chat.create(groupChatData);
    const groupChat = await Chat.findOne({
      _id: createdGroupChat._id,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    // send response
    res.status(200).send(groupChat);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const renameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;

    if (!chatId || !chatName) {
      throw new Error("chatId or chatName is missing");
    }

    // new:true will return the updated value
    const renamedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!renamedChat) {
      throw new Error("chat not found");
    }
    // send response
    res.status(200).send(renamedChat);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      throw new Error("chatId or userId is missing");
    }

    // userId cannot be removed from the chat(chatId) if user is not present in chat
    let c = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });
    if (!c) {
      throw new Error("user is not present");
    }

    // new:true will return the updated value
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removed) {
      throw new Error("chat not found");
    }
    // send response
    res.status(200).send(removed);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

const addToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
      throw new Error("chatId or userId is missing");
    }

    // userId cannot be added to the chat(chatId) if user is already present in chat
    let c = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });
    if (c) {
      throw new Error("user is already present");
    }

    // new:true will return the updated value
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      throw new Error("chat not found");
    }
    // send response
    res.status(200).send(added);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
    next(err);
  }
};

module.exports = {
  accessChats,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
