import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader,
     DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList,
      Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileDetails from './ProfileDetails';
import { useNavigate } from 'react-router-dom';
import { Effect } from 'react-notification-badge';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserList from '../User/UserList';
import NotificationBadge from 'react-notification-badge';
import { useDispatch, useSelector } from 'react-redux';
import { setChatSelected, setChats, setNotification } from '../../Context/actions/actions';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  //const { user, setChatSelected, chats, setChats, notification, setNotification} = ChatState();

  const { user, chats, notification } = useSelector((state) => ({
    user: state.user,
    chats: state.chats,
    notification: state.notification
  }));

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };

  const searchHandler = async () => {
    if (!search) {
        toast({
            title: 'the field is empty!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top-left"
          });
        return;
    }

    try {
        setLoading(true);

        const { data } = await axios.get(`/api/user?search=${search}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        setLoading(false);
        setSearchResult(data);
    } catch (error) {
        toast({
            title: 'Failed!',
            description: 'Failed to load the search results',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top-left"
          });
    }
  };

  const accessChat = async (userId) => {
    try {
        setLoadingChat(true)

        const { data } = await axios.post("/api/chat", { userId }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        });

        if (!chats.find((c) => c._id === data._id)) {
            setChats([data, ...chats]);
        }

        dispatch(setChatSelected(data));
        setLoadingChat(false);
        onClose();
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

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div>
        <Box 
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        width={"100%"}
        padding={"5px 10px 5px 10px"}
        borderWidth={"5px"}
        >
            <Tooltip label="Find friends to chat with" hasArrow placement='bottom-end'>
                <Button variant={"ghost"} onClick={onOpen}>
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: "none", md: "flex"}} px={"4"}>
                        Search Friends
                    </Text>
                </Button>
            </Tooltip>

            <Text fontSize={"xx-large"} fontFamily={"Work sans"}>
                For Love Of Writers
            </Text>
            <div>
                <Menu>
                    <MenuButton padding={1}>
                        <NotificationBadge 
                            count={notification.length}
                            effect={Effect.SCALE}
                        />
                        <BellIcon fontSize={"x-large"} m={1} />
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No messages"}
                        {notification.map(n => (
                            <MenuItem key={n._id} onClick={() => {
                                dispatch(setChatSelected(n.chat));
                                dispatch(setNotification(notification.filter(notif => notif !== n)));
                            }}>
                                {n.chat.isGroupChat ? `New Message in ${n.chat.chatName}`
                                : `New Message from ${getSender(user, n.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList> 
                </Menu>
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
                    </MenuButton>
                    <MenuList>
                        <ProfileDetails user={user}>
                            <MenuItem>Account</MenuItem>
                        </ProfileDetails>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>

        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderWidth={"1px"}>Search Friends</DrawerHeader>
                <DrawerBody>
                <Box display={"flex"} pb={2}>
                    <Input 
                        placeholder='Search by name or email'
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={searchHandler}>Search</Button>
                </Box>
                {loading ? (
                    <ChatLoading />
                ) : (
                    searchResult?.map(user => (
                        <UserList
                            key={user._id}
                            user={user}
                            functionHandler={() => accessChat(user._id)}
                        />
                    ))
                )}
                {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
            </DrawerBody>
            </DrawerContent>
        </Drawer>
    </div>
  );
}

export default SideDrawer