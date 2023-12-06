import React, { useEffect, useState } from 'react'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import CreateGroupChat from './miscellaneous/CreateGroupChat';
import { ChatState } from '../Context/ChatProvider';
import { useDispatch, useSelector } from 'react-redux';
import { setChatSelected, setChats } from '../Context/actions/actions';

const UserChats = ( { reloadChats }) => {
  const [loggedUser, setLoggedUser] = useState();
  //const { user, chatSelected, setChatSelected, chats, setChats} = ChatState();

  const { user, chatSelected, chats} = useSelector((state) => ({
    user: state.user,
    chatSelected: state.chatSelected,
    chats: state.chats
  }));

  const dispatch = useDispatch();

  const toast = useToast();
  

  const receiveChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      dispatch(setChats(data));
    } catch (error) {
      toast({
        title: 'Failed!',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top-left"
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    receiveChats();
  }, [reloadChats]);

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };
  return (
     <Box
      display={{ base: chatSelected ? "none" : "flex", md: "flex"}}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      width={{ base: "100%", md: "31%"}}
      borderRadius={"lg"}
      borderWidth={"1px"}
     >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px"}}
          fontFamily={"Work sans"}
          display={"flex"}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          Direct Messages
          <CreateGroupChat>
            <Button
              display={"flex"}
              fontSize={{ base: "17px", md: "10px", lg: "17px"}}
              rightIcon={<AddIcon />}
            >
              Create Group Chat
            </Button>
          </CreateGroupChat>
          
        </Box>
        <Box 
          display={"flex"}
          flexDir={"column"}
          p={3}
          bg={"#F8F8F8"}
          width={"100%"}
          height={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((c) => (
                <Box
                  onClick={() => dispatch(setChatSelected(c))}
                  cursor={"pointer"}
                  bg={chatSelected === c ? "#AA336A" : "#E8E8E8"}
                  color={chatSelected === c ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={c._id}
                >
                  
                  <Text>
                    {!c.isGroupChat ? getSender(loggedUser, c.users) : (c.chatName)}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
     </Box>
  )
}

export default UserChats