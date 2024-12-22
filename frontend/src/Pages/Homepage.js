import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
const Homepage = () => {
  return (
    <>
      <Container maxWidth="xl" centerContent className="box">
        <Box
          display="flex"
          justifyContent="center"
          backgroundColor="transparent"
          padding={3}
          width="100%"
          margin="40px 0 15px 0"
          borderRadius="10px"
          borderWidth="1px"
        >
          <Text
            fontSize="4xl"
            fontFamily="Work sans"
            color="white"
            fontStyle="italic"
          >
            Pavan-Chat-App
          </Text>
        </Box>

        <Box
          backgroundColor="transparent"
          width="100%"
          padding="4"
          borderRadius="lg"
          borderWidth="1px"
        >
          <Tabs variant="soft-rounded">
            <TabList marginBottom="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/*Login component*/}
                <Login />
              </TabPanel>

              <TabPanel>
                {/*Signup component*/}
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Homepage;
