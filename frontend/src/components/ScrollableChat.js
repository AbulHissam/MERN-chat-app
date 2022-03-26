import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameUser,
  calculateMargin,
} from "../helpers/ChatLogics";
import { ChatState } from "../Context/ContextProvider";
import { Tooltip, Avatar } from "@chakra-ui/react";

function ScrollableChat({ messages }) {
  const { user } = ChatState();
  return (
    <>
      <ScrollableFeed>
        {messages.length !== 0 &&
          messages.map((msg, i) => {
            return (
              <div style={{ display: "flex" }} key={msg._id}>
                {/*last received message from the other user  */}
                {isSameSender(messages, msg, i, user._id) ||
                  (isLastMessage(messages, i, user._id) && (
                    <Tooltip
                      label={msg.sender.name}
                      placement="bottom-start"
                      hasArrow
                    >
                      <Avatar
                        mt="7px"
                        mr={1}
                        size="sm"
                        cursor="pointer"
                        name={msg.sender.name}
                        // src={msg.sender.pic}
                      />
                    </Tooltip>
                  ))}
                <span
                  style={{
                    backgroundColor: `${
                      msg.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    marginLeft: calculateMargin(messages, msg, i, user._id),
                    marginTop: isSameUser(messages, msg, i, user._id) ? 3 : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {msg.content}
                </span>
              </div>
            );
          })}
      </ScrollableFeed>
    </>
  );
}

export default ScrollableChat;
