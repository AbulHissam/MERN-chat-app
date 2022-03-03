export const getSender = (loggedUser, users) => {
  if (!loggedUser) return null;
  // for  displaying the name of the users in My Chats we should show the name of the other user not the logged in user name
  // users array will have only two values [{loggedUser},{userInvolvedInChatWithLoggedUser}]
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
