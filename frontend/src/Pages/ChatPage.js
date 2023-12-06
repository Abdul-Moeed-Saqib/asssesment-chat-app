import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import UserChats from '../components/UserChats';
import ChatBox from '../components/ChatBox';
import { useSelector } from 'react-redux';

const ChatPage = () => {
  //const { user } = ChatState();

  const { user } = useSelector((state) => ({
    user: state.user
  }));

  const [reloadChats, setReloadChats] = useState(false)

  return (
    <div style={{ width: "100%"}}>
      {user && <SideDrawer />}
      <Box 
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"91.5vh"}
        padding={"10px"}
      >
        {user && <UserChats reloadChats={reloadChats} />}
        {user && <ChatBox reloadChats={reloadChats} setReloadChats={setReloadChats} />}
      </Box>
    </div>
  )
  
}

export default ChatPage