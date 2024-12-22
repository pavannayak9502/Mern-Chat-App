import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false); //This is for to update the users for single user or group chat users if they exit from group(render them).

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />} {/*For search bar.*/}
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          height="91.5vh"
          padding="1rem"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}{" "}
          {/*Left side user & chat window */}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}{" "}
          {/* Right side chatting window */}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;
