import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ContextProvider";
import { getFullSenderDetails, getSender } from "../helpers/ChatLogics";
import ProfileModal from "./misc/ProfileModal";
import UpdateGroupChatModal from "./misc/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (event) => {
    // if the pressed is not enter or if the newMessage is empty dont post the message
    if (event.key !== "Enter" || !newMessage) return null;
    socket.emit("stop typing", selectedChat._id);
    try {
      const message = {
        content: newMessage,
        chatId: selectedChat._id,
      };
      // resetting the newMessage field once it is posted
      setNewMessage("");
      const { data } = await axios.post("/api/message", message, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessages([...messages, data]);

      // emit an event to send a new message
      socket.emit("new message", data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // refer https://socket.io/docs/v4/client-socket-instance/
    socket = io(ENDPOINT);

    // emit setup event to server //refer server.js in backend
    socket.emit("setup", user);

    // handle "connected" event emitted from server"
    socket.on("connected", () => setSocketConnected(true));

    // to handle typing
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/message/${selectedChat._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMessages(data);
        setLoading(false);

        // emit a event to server for joining a chat with room id as selectedChat._id
        // for typing functionality
        socket.emit("join chat", selectedChat._id);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // if chat is not selected or doesn't match current chat
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // notification
      } else {
        // include the newMessageReceived to the list of existing messages
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (event) => {
    setNewMessage(event.target.value);
    if (!socketConnected) return null;

    if (!typing) {
      setTyping(true);
      // if typing emit a event to server that user is typing
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    // animation will be shown for 3 seconds
    setTimeout(() => {
      const currTime = new Date().getTime();
      const timeDiff = currTime - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        setTyping(false);
        // emit an event to stop typing
        socket.emit("stop typing", selectedChat._id);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {/* to go back to MyChats in base screen */}
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {/* if it is not a group chat display user name else display groupname.selectedChat can be undefined if a chat is not selected */}
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getFullSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                    animationData={animationData}
                    style={{
                      width: 70,
                      marginLeft: 0,
                    }}
                  />
                </div>
              ) : null}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
