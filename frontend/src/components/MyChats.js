import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider.js";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics.js";
import GroupChatModel from "./miscellaneous/GroupChatModel.js";

const MyChats = ({ fetchAgain }) => {
  //The fetchAgain prameter(prop) is passed from floder pages => ChatPage.js file(number line: 24) to the MyChats component from its parent component. This parameter is an boolean variable used to trigger a re-fetch of the chats when it changes. For example, it might indicate whether a user has just created, deleted, or updated a chat, and the MyChats component should re-fetch the latest list of chats to reflect the changes.
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    //Fetch all the chats for the current logged user whey logged in.
    //console.log(user._id);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    //Fetch all the chats for the current logged user.
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo"))); //Store the userInfo in setLoggedUser useState variable.
    fetchChats(); //Calling the fetchChats method to get all the chats of current logged user.
    // eslint-disable-next-line
  }, [fetchAgain]); //In the useEffect hook, fetchAgain is included as a dependency. This means that every time the value of fetchAgain changes, the useEffect hook will be re-executed. Inside the useEffect, you are calling fetchChats, which triggers the fetching of chats for the logged-in user. Essentially, the useEffect listens for changes in fetchAgain and triggers a re-fetch of the user's chats whenever this value changes. This ensures that the MyChats component always has the latest chat data when certain conditions (like chat creation, deletion, or updating) occur in the application.

  return (
    <>
      <Box //For side chat box.
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        padding={3}
        background="white"
        width={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box //For Header name and group chat button
          pb={3} //pb means Bottom padding.
          px={3} //px means padding on left and right
          fontSize={{ base: "28px", md: "30px" }}
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          MyChats
          {""}
          {/* For groupchat button we are wrapping inside the Folder miscellaneous => GroupChatModel.js file*/}
          <GroupChatModel>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModel>
        </Box>

        <Box //Display the users on left side chat window.
          display="flex"
          flexDirection="column"
          padding={3}
          background="#F8F8F8"
          width="100%"
          height="100%"
          borderRadius="lg"
          overflow="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  background={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat //First check weather it's a single chat or group chat (if it's a single chat then open getSender method from config folder => chatLogics file and display sender name.
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                    {/* else if it's group chat then display group chat name. */}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
