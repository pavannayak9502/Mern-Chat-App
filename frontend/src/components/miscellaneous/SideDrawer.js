import React from "react";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import {
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, Avatar } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react"; //For left side search drawer.
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvator/UserListItem";
import { useNavigate } from "react-router-dom";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

import "../styles.css";

const SideDrawer = () => {
  //For side bar search.
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const navigate = useNavigate();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async (event) => {
    //For serching the user with name & email which was provided by current logged user.
    event.preventDefault();

    if (!search) {
      //If no input provided and submited the search button then display this waring.
      toast({
        title: "Please Enter something in user",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    //Fetch the name & email which was provided by current logged user.
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      //Passing the user search name & email to the backend url path to fetch data from database and then after getting the data we are displaying the response to the searched user.
      const { data } = await axios.get(`/api/user?search=${search}`, config); //Because our routes are protected due to that we are passing the current logged user token to the backend url route to fetch the searched user data.

      if (data.length === 0) {
        //If no user found by searched user from our backend of database then display ("no user found").
        toast({
          title: "No User Found",
          description: "Try a different search.",
          status: "info",
          duration: 3000,
          isClosable: true,
          position: "top-left",
        });
      }

      setLoading(false);
      setSearchResult(data); //We are passing the backend response to the setSearchResult useState variable.

      // Clear the search input and results after selecting a user
      setSearch(""); //Reset the search input after closing the side bar.
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  //Creating the new chat with search selected user.
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      //Creating the new chat with searched user.
      const { data } = await axios.post("/api/chat", { userId }, config); //Calling our backend url route and also passing the user searched id to backend api, and our backend api will create a new chat with searched user.

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //If user already friend to that search user then display all their chats.
      setSelectedChat(data);
      setLoadingChat(false);

      // Clear the search input and results after selecting a user
      setSearch(""); // Reset the search input
      setSearchResult([]); // Clear the search results

      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logoutHandler = () => {
    //Logout the chat page and redirect to login page and also clear the user information from localStorage.
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "100%",
          padding: "5px 10px 5px 10px",
          borderWidth: "5px",
        }}
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            {/*Here onClick used for to open left side search drawer.*/}
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              {/* Display for mobile should be none and for medium screen the display should be flex.  px means horizontal padding*/}
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Pavan-Chat-App
        </Text>
        <div>
          <Menu>
            {/* The complete menu for notifications. To display the notification badge we need to install the package : npm install react-notification-badge@latest --force */}
            <MenuButton padding="1px" marginRight={6}>
              {/* */}
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" margin="1px" />
              {/* Bell icon for Notifications.*/}
            </MenuButton>
            <MenuList paddingLeft={2}>
              {
                //Displaying for list of notifications.
                !notification.length && "No New Messages" //If no messages means display no new messages.
              }
              {
                //If messages are there in notification then we are mapping the each notification to display in the notification badge.
                notification.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      //Once user click on the notification we are navigating to selected chat from which the user got the message. And then clear the notification from notification array.
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {
                      //First condition was if message notification is from group chat means display(message from group chat name).
                      //Second condition was if message was not from group chat means that must be 1:1 chat then display the sender name and pic from getSender logic function from config folder => chatLogics.js file.
                      notif.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            notif.chat.users
                          )}`
                    }
                  </MenuItem>
                ))
              }
            </MenuList>
          </Menu>

          <Menu>
            {/* For profile menu */}
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              {/*The MenuDivider will give space between for MenuItems.*/}
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {""}
      {/*For Left side search user drawer component. The onClick attached to open the left side drawer at line 50*/}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="2px">Search user</DrawerHeader>
          <DrawerBody>
            <Box style={{ display: "flex", paddingBottom: "2px" }}>
              <Input
                placeholder="Search name & email"
                marginRight="2px"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {""}
            {/* For loding the chat (loadingChat)useState variable*/}
            {loadingChat && (
              <Spinner marginLeft="auto" display="flex" marginTop="10px" />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
