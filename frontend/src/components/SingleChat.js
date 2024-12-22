import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Center,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
  Button, // Import Chakra UI Button
} from "@chakra-ui/react";
import { IconButton, ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics.js";
import ProfileModal from "../components/miscellaneous/ProfileModal.js";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.js";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat.js";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000"; //This variable(ENDPOINT) having the url of localhost for using the socket(real-time communication).
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]); //The below three states are for sending messages state(messages, loading, newMessage).
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  //The both typing and isTyping states for displaying that user is something in the chat.
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const toast = useToast();

  //Logic for typing indicator for chat room.
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  //This useEffect state is for rendering the chats for user.
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  //This useEFfect state is for rendering the socket.
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  //For sending the message to the user.
  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage(""); //Clear input field after sending the message
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]); //Add new message to the chat
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }
  };

  //Typing Indicator logic.
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  //For fetching messages for the selected user
  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoadingChat(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Message.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  //This useEffect state is for receiving new messages and handling notifications
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);

          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            background="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {loadingChat ? (
              <Spinner
                size="xl"
                width={20}
                heigth={20}
                alignSelf={Center}
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl isRequired marginTop={3}>
              {isTyping ? (
                <Box display="flex" alignItems="center" marginBottom={3}>
                  <Lottie
                    options={defaultOptions}
                    width={50}
                    style={{ marginLeft: 10 }}
                  />
                </Box>
              ) : null}
              <Box display="flex" alignItems="center">
                <Input
                  variant="filled"
                  background="#E0E0E0"
                  placeholder="Enter a message..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button onClick={sendMessage} colorScheme="teal" marginLeft={2}>
                  Send
                </Button>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          width="100%"
          background="linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)"
        >
          <Text
            fontSize="5xl"
            paddingBottom={3}
            fontFamily="Work sans"
            color="whiteAlpha.900"
          >
            Click on a user to start chatting...
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
