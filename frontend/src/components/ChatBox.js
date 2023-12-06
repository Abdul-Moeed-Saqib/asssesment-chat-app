import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import MessageView from './MessageView';
import { useSelector } from 'react-redux';

const ChatBox = ({ reloadChats, setReloadChats }) => {

  //const { chatSelected } = ChatState();
  const { chatSelected } = useSelector((state) => ({
    chatSelected: state.chatSelected
  }));

  return (
    <Box display={{ base: chatSelected ? "flex" : "none", md: "flex"}}
      alignItems={"center"}
      flexDir={"column"}
      p={3}
      bg={"white"}
      width={{ base: "100%", md: "68%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <MessageView reloadChats={reloadChats} setReloadChats={setReloadChats} /> 
    </Box>
  )
}

export default ChatBox