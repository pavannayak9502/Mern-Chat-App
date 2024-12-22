import React, { useState } from "react";
import { Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Input,
  Box,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvator/UserListItem.js";
import UserBadgeItem from "../UserAvator/UserBadgeItem.js";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); //For modal the useDisclosure() is a custom hook used to help handle common open, close, or toggle scenarios. It can be used to control feedback component such as Modal, AlertDialog, Drawer, etc.
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    //The handleSearch method will take an parameter as query.
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Ocuured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 3000,
        position: "bottom",
        isClosable: true,
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      //If searched user already inside the group then display toast error.
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]); //If searched user not there in that group then add the new user to that group array using spread operator and new user.
  };

  const handleDelete = (delUser) => {
    //Delete the user from the group array.
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id)); //The .filter() method loops through the selectedUsers array, and for each sel (representing an individual user), it checks if the user's _id is not equal to the _id of the user to be deleted (delUser._id).
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      //If group chat name empty or no users selected for group then display error.
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      ); //In the post request url(group) we are passing 1.Group chat name and 2. json.stringify of selected users array and also mapping the each user(id) to store in the database and finally the config which conatins current logged user group admin token.

      setChats([data, ...chats]);
      onClose();
      toast({
        //After successfully creating the group chat we are displaying the suceess toast.
        title: "New Group Chat Created!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create the group chat",
        description: error.response.data,
        status: "warning",
        duration: 3000,
        position: "bottom",
        isClosable: true,
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>{" "}
      {/* We have already created button inside the groupChatModel wrapper from MyChats.js file line number:74, so need no to create another button for group chat. When we click on that button the inside span element will automatic render that button.*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={{ base: "25px", md: "35px" }}
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                marginBottom="3px"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Pavan Lavori Nayak"
                marginTop="10px"
                marginBottom="3px"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {""}
            {/* For Selected users*/}
            <Box width="100%" display="flex" flexWrap="wrap">
              {
                // Selected users from search.
                selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={user._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))
              }
            </Box>

            {""}
            {/* Render the users from handleGroup*/}
            {
              //For rendering searched user.
              loading ? (
                <Spinner color="red" marginLeft="280px" marginTop="15px" />
              ) : (
                //Optional chaing for search user results for group chat.
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )
            }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" margin="5px" onClick={handleSubmit}>
              Create Chat
            </Button>
            <Button colorScheme="red" margin="5px" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
