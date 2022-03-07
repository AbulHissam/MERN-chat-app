import React from "react";

function ScrollableChat({ messages }) {
  return (
    <>
      {messages.map((msg) => {
        return msg.content;
      })}
    </>
  );
}

export default ScrollableChat;
