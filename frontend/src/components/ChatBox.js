import React from "react";
import { ChatState } from "../Context/ChatProvider.js";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat.js";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  //The fetchAgain prameter(prop) and setFetchAgain parameter(prop) is passed from floder pages => ChatPage.js(number line:26) file to the MyChats component from its parent component. This parameter is a boolean variable used to trigger a re-fetch of the chats when it changes. For example, it might indicate whether a user has just created, deleted, or updated a chat, and the ChatBox component should re-fetch the latest list of chats to reflect the changes.
  const { selectedChat } = ChatState();

  return (
    <>
      <Box
        display={{ base: selectedChat ? "flex" : "none", md: "flex" }} //For mobile the chatBox screen will be none when mobile user select the user chat on left side chat window then chat box will be displayed as flex. For bigger screen display both left side users box and right side chat box.
        alignItems="center"
        flexDirection="column"
        padding={3}
        background="white"
        width={{ base: "100%", md: "68%" }} //For mobile we are providing 100% width and for laptop & tab we are providing 68% width.
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
};

export default ChatBox;
