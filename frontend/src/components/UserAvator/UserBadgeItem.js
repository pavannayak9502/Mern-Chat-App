import React from "react";
import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        margin={1}
        marginTop={4}
        marginBottom={2}
        fontSize={12}
        background="green"
        color="white"
        cursor="pointer"
        onClick={handleFunction}
      >
        {user.name}
        <CloseIcon paddingLeft={1} />
      </Box>
    </>
  );
};

export default UserBadgeItem;
