import React, { useState } from "react";
import { ChatState } from "../Context/ContextProvider";
import Navbar from "../components/misc/Navbar";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { Box } from "@chakra-ui/react";

function ChatPage() {
  const [chats, setChats] = useState({});
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <Navbar />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
}

export default ChatPage;
