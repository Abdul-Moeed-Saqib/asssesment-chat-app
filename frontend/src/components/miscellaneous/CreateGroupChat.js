import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserList from '../User/UserList';
import SelectedUser from '../User/SelectedUser';
import { setChats } from '../../Context/actions/actions';
import { useDispatch, useSelector } from 'react-redux';

const CreateGroupChat = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [usersSelected, setUsersSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();

  //const { user, chats, setChats} = ChatState();
  const { user, chats } = useSelector((state) => ({
    user: state.user,
    chats: state.chats
  }));

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
          setLoading(false);
    }
  }

  const groupHandler = (addedUser) => {
    if (usersSelected.includes(addedUser)) {
        toast({
            title: 'Friend is already selected!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
        return;
    }

    setUsersSelected([...usersSelected, addedUser]);
  }

  const submitHandler = async () => {
    if (!groupChatName || !usersSelected) {
        toast({
            title: 'The fields are empty!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
        return;
    }

    try {
        const { data } = await axios.post("/api/chat/creategroup", {
            name: groupChatName,
            users: JSON.stringify(usersSelected.map(u => u._id))
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        dispatch(setChats([data, ...chats]));
        setUsersSelected([]);
        setResult([]);
        onClose();
        toast({
            title: 'Created Group Chat!',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: "top"
          });
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

  const deleteHandler = (removeUser) => {
    setUsersSelected(usersSelected.filter(su => su._id !== removeUser._id));
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
                <Input placeholder='Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input placeholder='Add friends' mb={1} onChange={(e) => searchHandler(e.target.value)}/>
            </FormControl>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
                {usersSelected.map(u => (
                    <SelectedUser 
                        key={u._id}
                        user={u}
                        functionHandler={() => deleteHandler(u)}
                    />
                ))}
                {loading ? <Spinner ml={"auto"} display={"flex"} /> : (
                    result?.slice(0, 4).map(u => (
                        <UserList key={u._id} user={u} functionHandler={() => groupHandler(u)} />
                    ))
                )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='pink' onClick={submitHandler}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateGroupChat