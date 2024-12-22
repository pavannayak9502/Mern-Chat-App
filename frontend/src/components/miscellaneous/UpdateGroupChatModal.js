import React, { useState } from "react";

import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Box,
  FormControl,
  Input,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvator/UserBadgeItem";
import axios from "axios";
import { Spinner } from "@chakra-ui/react";
import UserListItem from "../UserAvator/UserListItem.js";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameloading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    //To rename the group chat name.
    if (!groupChatName) {
      //If no rename means just return(leave).
      return;
    }

    try {
      setRenameloading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data); //After passing the rename chat name to store in the backend database using put request. After successfully storing the new chat name into database. After that we are passing the new rename group chat name to setSelectedChat useState array variable to store(new rename group chatname).
      setFetchAgain(!fetchAgain); //Refetching the entire users and also fetching for single chats and group chats. It an parameter from ({fetchAgain, setFetchAgain}) line number: 26.
      setRenameloading(false); //After group chat rename were suceessful we are setting setRenameloading into false.
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setRenameloading(false); //If group chat rename were unsuceessful we are setting setRenameloading into false.
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    //To search the users from our database and them to our chat group.
    setSearch(query); //Passing the new name value query into setSearch useState variable.

    if (!query) {
      //If no user input means just return.
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config); // We are passing the new user name to our backend using post request to check into the database to check if the user was exists already.
      console.log(data);
      setLoading(false); //Stop the loading to false.
      setSearchResult(data); //We are passing the new user details( get requset data line:95) into SetSearchResult array useState variable. After that we are adding the new user to our chat group.
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    //Adding new to group.
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      //If new user was already exists in chat group then display toast(user exists).
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      //If group admin id(selectedChat.groupAdmin._id) doesn't match with current logged user id(user._id) means then display error(only admins can add someone to group).
      toast({
        title: "Only admins can add someone to group!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        { chatId: selectedChat._id, userId: user1._id },
        config
      ); //We are the group chat id and new user id to add the new user to chat group using put request.

      setSelectedChat(data); //After passing the group chat id along with new user id to store in the backend database using put request. After successfully store in databae we are passing the new user into to the setSelectedChat useState array variable to store(new user into group chat array).
      setFetchAgain(!fetchAgain); //Refetching the entire users and also fetching for single chats and group chats. It an parameter from ({fetchAgain, setFetchAgain}) line number: 26.
      setLoading(false); //After new user added to group we are setting setLoading into false.
    } catch (error) {
      toast({
        title: "Error Ocuured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    // handleRemove method will remove the user(parameter(user1)) from group chat. Only group admin have that access to remove the user from chat group.
    //The line number 243 is for current logged user(if user wants to leave chat group)  and line number 293(if group admin removed the user from chat group) both are same function but logic was different, the logic was returned at line number:197.
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      //If group admin id doesn't with current logged user and parameter(user1._id) present logged user id doesn't match with logged user then display toast error.
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1.id === user._id ? setSelectedChat() : setSelectedChat(data); //The main logic for both handleRemove() : So if current user who want's to leave the group or left the group then we need to make setSelectedChat() to empty obviously we don't want the user to see the chat's from that exited group. If group admin removed the user from group we are going logic through setSelectedChat(data) and then user will be deleted from group and chat updates for him.
      setFetchAgain(!fetchAgain); //After user leaved group himself or group admin removed the user from group then again fetch the chats. The SetFetchAgain and fetchAgain we are taken the parameters from line number:35 .
      fetchMessages(); //Parameter passed from line number:26.
      setLoading(false); //After user leaved group himself or group admin removed the user from group, set our setLoading state into false.
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton //Icon button for group chat for both smaller and bigger screens.
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        {" "}
        {/* The complete model(div) for group chat for smaller and bigger screens. isCenterd means keep the model(div) center.*/}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            color="blue"
          >
            {selectedChat.chatName} {/* For group chat name in model */}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap" paddingBottom={3}>
              {/* Rendering currently users inside of the chat group. If group admin want to remove any user from he can remove for that we implemented handleRemove(u) and passing (u) parameter of that particular removing user id. */}
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input //To rename the group chat name.
                placeholder="Chat Name"
                marginBottom={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="pink"
                marginLeft={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input //Adding the new user to the chat group. And handleSearch method is used to search the users from our database and add them to our chat group.
                placeholder="Add User to group"
                marginBottom={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner
                size="lg"
                marginTop="10px"
                marginLeft={"40%"}
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
              />
            ) : (
              //We are mapping through our searchResult array to display the search user and after that we are adding the selected particular user to our chat group.
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => handleRemove(user)}
              colorScheme="red"
              margin={5}
            >
              Leave Group
            </Button>
            <Button colorScheme="blue" marginRight={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
