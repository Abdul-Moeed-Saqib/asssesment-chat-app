import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserList = ({ user, functionHandler}) => {

  return (
    <Box
        onClick={functionHandler}
        cursor={"pointer"}
        bg={"#E8E8E8"}
        _hover={{
            background: "#AA336A",
            color: "white"
        }}
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        color={"black"}
        px={3}
        py={2}
        mb={2}
        borderRadius={"lg"}
    >
        <Avatar 
            mr={2}
            size={"sm"}
            cursor={"pointer"}
            name={user.name}
            src={user.pic}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize={"x-small"}>
                <b>Email: </b>
                {user.email}
            </Text>
        </Box>
    </Box>
  )
}

export default UserList