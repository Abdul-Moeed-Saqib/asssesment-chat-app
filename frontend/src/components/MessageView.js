import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileDetails from './miscellaneous/ProfileDetails';
import UpdateGroupChat from './miscellaneous/UpdateGroupChat';
import axios from 'axios';
import io from "socket.io-client";
import ChatMessages from './ChatMessages';
import { setChatSelected, setNotification } from '../Context/actions/actions';
import { useDispatch, useSelector } from 'react-redux';

const endPoint = "http://localhost:5000";

let socket, chatSelectedCompare;

const MessageView = ({ reloadChats, setReloadChats }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);



  //const { user, chatSelected, setChatSelected, notification, setNotification } = ChatState();
  const toast = useToast();
  const dispatch = useDispatch();

  const { user, chatSelected, notification} = useSelector((state) => ({
    user: state.user,
    chatSelected: state.chatSelected,
    notification: state.notification
  }));

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
  };

  const allMessages = async () => {
    if (!chatSelected) {
        return;
    }

    try {
        setLoading(true);

        const { data } = await axios.get(`/api/message/${chatSelected._id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        

        console.log(data);
        setMessages(data);
        setLoading(false);

        socket.emit("join chat", chatSelected._id)
    } catch (error) {
        toast({
            title: 'Failed!',
            description: "Failed to load messages",
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
        setLoading(false);
    }
  };

   useEffect(() => {
    socket = io(endPoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    allMessages();

    chatSelectedCompare = chatSelected;
  }, [chatSelected]);

  useEffect(() => {
    socket.on("message recieved", (messageRecieved) => {
        if (!chatSelectedCompare || chatSelectedCompare._id !== messageRecieved.chat._id) {
            if (!notification.includes(messageRecieved)) {
                dispatch(setNotification([messageRecieved, ...notification]))
                setReloadChats(!reloadChats);
            }
        } else {
            setMessages([...messages, messageRecieved]);
        }
    })
  })

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
        socket.emit("stop typing", chatSelected._id);
        try {
            setNewMessage("");

            const { data } = await axios.post("/api/message", {
                content: newMessage,
                chatId: chatSelected._id
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            })

            socket.emit("new message", data)
            setMessages([...messages, data])
        } catch (error) {
            toast({
                title: 'Failed!',
                description: "Failed to send message",
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "top"
              });
        }
    }
  }
  
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
        return;
    }

    if (!typing) {
        setTyping(true);
        socket.emit("typing", chatSelected._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", chatSelected._id);
          setTyping(false);
        }
    }, timerLength);
  }
  
  return (
    <>
        {chatSelected ? (
            <>
                <Text
                    fontSize={{ base: "28px", md: "30px"}}
                    pb={3}
                    px={2}
                    width={"100%"}
                    fontFamily={"Work sans"}
                    display={"flex"}
                    justifyContent={{ base: "space-between" }}
                    alignItems={"center"}
                >
                    <IconButton 
                        display={{ base: "flex", md: "none"}}
                        icon={<ArrowBackIcon />}
                        onClick={() => dispatch(setChatSelected(""))}
                    />
                    {!chatSelected.isGroupChat ? (
                        <>
                            {getSender(user, chatSelected.users).name}
                            <ProfileDetails user={getSender(user, chatSelected.users)}  />
                        </>
                    ) : (
                        <>
                            {chatSelected.chatName.toUpperCase()}
                            <UpdateGroupChat reloadChats={reloadChats}
                             setReloadChats={setReloadChats} 
                             allMessages={allMessages}/>
                        </>
                    )}
                </Text>
                <Box
                    display={"flex"}
                    flexDir={"column"}
                    justifyContent={"flex-end"}
                    p={3}
                    bg={"#E8E8E8"}
                    width={"100%"}
                    height={"100%"}
                    borderRadius={"lg"}
                    overflowY={"hidden"}
                >
                    {loading ? (
                        <Spinner
                            size={"xl"}
                            width={20}
                            height={20}
                            alignSelf={"center"}
                            margin={"auto"}
                        />
                    ) : (
                        <div style={{ display: "flex", 
                        flexDirection: "column", 
                        overflowY: "scroll", 
                        scrollbarWidth: "none"}}>
                            <ChatMessages messages={messages} />
                        </div>
                    )}

                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <div>
                            loading...
                        </div> : <></>}
                        <Input
                            variant={"filled"}
                            bg={"#E0E0E0"}
                            placeholder={"Message"}
                            onChange={typingHandler}
                            value={newMessage}
                        />
                    </FormControl>
                </Box>
            </>
        ) : (
            <Box display={"flex"} alignItems={"center"} 
            justifyContent={"center"} height={"100%"}>
                <Text fontSize={"xxx-large"} pb={3} fontFamily={"Work sans"}>
                    Select a friend to start talking!
                </Text>

            </Box>
        )}
    </>
  )
}

export default MessageView