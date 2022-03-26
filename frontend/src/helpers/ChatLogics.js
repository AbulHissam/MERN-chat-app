export const getSender = (loggedUser, users) => {
  if (!loggedUser) return null;
  // for  displaying the name of the users in My Chats we should show the name of the other user not the logged in user name
  // users array will have only two values [{loggedUser},{userInvolvedInChatWithLoggedUser}]
  return loggedUser._id === users[0]._id ? users[1].name : users[0].name;
};

export const getFullSenderDetails = (loggedUser, users) => {
  if (!loggedUser || !users) return null;
  return loggedUser._id === users[0]._id ? users[1] : users[0];
};

export const isSameSender = (messages, msg, i, userId) => {
  // next message sender id and current msg sender id should be different if they are from different user else they are same user
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== msg.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  const len = messages.length;
  // if the message is a last message and it is not from the same sender
  return (
    i === len - 1 &&
    messages[len - 1].sender._id &&
    messages[len - 1].sender._id !== userId
  );
};

export const isSameUser = (messages, msg, i) => {
  // check if previous message sender id and current msg sender id are same
  return i > 0 && messages[i - 1].sender._id === msg.sender._id;
};

export const calculateMargin = (messages, msg, i, userId) => {
  // u1->logged in user or sent messages
  // u2->other user who is sending the message or received messages
  if (i < messages.length - 1) {
    // consecutive messages  from same users and he is the logged in user
    // m1-u1
    // m2-u1
    // m3-u1
    if (
      msg.sender._id === messages[i + 1].sender._id &&
      msg.sender._id === userId
    )
      return "auto";
    // message 1 sent from logged in user and message 2 is received message from other user
    // m1-u1
    // m2-u2
    else if (
      msg.sender._id !== messages[i + 1].sender._id &&
      msg.sender._id === userId
    )
      return "auto";
  }
  // last message and it is sent message by logged in user;
  if (i === messages.length - 1 && msg.sender._id === userId) return "auto";

  // last message and it is a received message other user;
  //  this because we will show avatar of user for last received message
  if (i === messages.length - 1 && msg.sender._id !== userId) return 0;

  // if not they are received messages from other user
  return 33;
};
