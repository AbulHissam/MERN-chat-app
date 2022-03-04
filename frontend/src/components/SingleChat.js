import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ContextProvider";
import { getFullSenderDetails } from "../helpers/ChatLogics";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat } = ChatState();
  return (
    <Box>
      <Text>
        {/* if it is not a group chat display user name else display groupname.selectedChat can be undefined if a chat is not selected */}
        {!selectedChat?.isGroupChat
          ? getFullSenderDetails(user, selectedChat?.users)?.name
          : selectedChat.chatName}
      </Text>
    </Box>
  );
}

export default SingleChat;
