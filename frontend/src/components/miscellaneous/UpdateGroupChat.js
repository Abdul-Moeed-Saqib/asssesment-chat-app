import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton,
     ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import SelectedUser from '../User/SelectedUser';
import axios from 'axios';
import UserList from '../User/UserList';
import { useDispatch, useSelector } from 'react-redux';
import { setChatSelected } from '../../Context/actions/actions';

const UpdateGroupChat = ({ reloadChats, setReloadChats, allMessages}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  //const { user, chatSelected, setChatSelected } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const dispatch = useDispatch();

  const { user, chatSelected } = useSelector((state) => ({
    user: state.user,
    chatSelected: state.chatSelected
  }));

  const groupHandler = async (addedUser) => {
    if (chatSelected.users.find(u => u._id === addedUser._id)) {
        toast({
            title: 'Friend is already selected!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
        return;
    }

    if (chatSelected.groupAdmin._id !== user._id) {
        toast({
            title: 'Admins are only allowed to add more friends!',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
        return;
    }

    try {
        setLoading(true);

        const { data } = await axios.put('/api/chat/addtogroup', {
            chatId: chatSelected._id,
            userId: addedUser._id
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        dispatch(setChatSelected(data));
        setReloadChats(!reloadChats);
        setLoading(false);
    } catch (error) {
        toast({
            title: 'Failed!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });

          setLoading(false);
    }
  }

  const deleteHandler = async (removeUser) => {
    if (chatSelected.groupAdmin._id !== user._id && removeUser._id !== user._id) {
        toast({
            title: 'Admins are only allowed to remove friends!',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
        return;
    }

    try {
        setLoading(true);

        const { data } = await axios.put('/api/chat/removefromgroup', {
            chatId: chatSelected._id,
            userId: removeUser._id
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        removeUser._id === user._id ? dispatch(setChatSelected()) : dispatch(setChatSelected(data));
        setReloadChats(!reloadChats);
        allMessages();
        setLoading(false);

        if (removeUser._id === user._id) {
            onClose();
        }
    } catch (error) {
        toast({
            title: 'Failed!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });

          setLoading(false);
    }
  }

  const updateHandler = async () => {
    if (!groupChatName) {
        return;
    }

    try {
        setUpdateLoading(true);

        const { data } = await axios.put("/api/chat/updatename", {
            chatId: chatSelected._id,
            chatName: groupChatName
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        dispatch(setChatSelected(data));
        setReloadChats(!reloadChats);
        setUpdateLoading(false);
    } catch (error) {
        toast({
            title: 'Failed!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });

          setUpdateLoading(false);
    }
    setGroupChatName("");
  }

  const searchHandler = async (query) => {
    setSearch(query);

    if (!query) {
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
        setResult(data);
    } catch (error) {
        toast({
            title: 'Failed!',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
    }
  }

  

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >{chatSelected.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
                {chatSelected.users.map(u => (
                    <SelectedUser 
                    key={u._id}
                    user={u}
                    functionHandler={() => deleteHandler(u)}
                    />
                ))}
            </Box>
            <FormControl display={"flex"}>
                <Input placeholder='Name' value={groupChatName} mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
                <Button
                variant={"solid"}
                backgroundColor={"teal"}
                color={"white"}
                ml={1}
                isLoading={updateLoading}
                onClick={updateHandler}
            >Update</Button>
            </FormControl>
            <FormControl>
                <Input placeholder='Add friends' mb={1} onChange={(e) => searchHandler(e.target.value)}/>
            </FormControl>

            {loading ? <Spinner ml={"auto"} display={"flex"} /> : (
                    result?.slice(0, 4).map(u => (
                        <UserList key={u._id} user={u} functionHandler={() => groupHandler(u)} />
                    ))
                )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' onClick={() => deleteHandler(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChat