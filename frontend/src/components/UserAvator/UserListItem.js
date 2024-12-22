import React from "react";
import { Box, Avatar, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        background="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        width="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3} //px means padding on left and right.
        py={2} //py means padding on top and bottom.
        borderRadius="lg"
        marginTop="10px"
      >
        <Avatar
          marginRight="2px"
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="xs">
            <b>Email: </b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
