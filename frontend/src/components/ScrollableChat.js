import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { Tooltip, Avatar } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  //npm install react-scrollable-feed

  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map(
          (
            m,
            i // Mapping of each messages to display the messges for user, parameters of m,i => m=message, i=index
          ) => (
            <div style={{ display: "flex" }} key={m._id}>
              {" "}
              {/* key={m._id} Means we want to display each id of message. */}
              {(isSameSender(messages, m, i, user._id) ||
                isLastMessage(messages, i, user._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    marginTop={"7px"}
                    marginRight={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                    src={m.sender.pic}
                  />
                </Tooltip>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#bee3f8" : "#b9f5d0" // #bee3f8 is blue color and #b9f5d0 is light green color.
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          )
        )}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
