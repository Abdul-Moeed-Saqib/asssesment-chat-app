import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const SelectedUser = ({ user, functionHandler}) => {
  return (
    <Box
        px={2}
        py={1}
        borderRadius={"lg"}
        m={1}
        mb={2}
        variant={"solid"}
        fontSize={12}
        bg="#AA336A"
        color={"white"}
        cursor={"pointer"}
        onClick={functionHandler}
    >
        {user.name}
        <CloseIcon pl={1} />
    </Box>
  )
}

export default SelectedUser