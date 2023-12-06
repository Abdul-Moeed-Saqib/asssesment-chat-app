import React, { useState } from 'react'
import axios  from 'axios'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const submitHandler =  async () => {
        if (!email || !password) {
            toast({
                title: 'Please fill down the fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });
            setLoading(false);
            return;
        } 

        try {
            const { data } = await axios.post("/api/user/login", { email, password }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            toast({
                title: 'You are Login!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        } catch (error) {
            console.log(error);
            toast({
                title: 'Failed!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });
            setLoading(false);
        }
    };

  return (
    <VStack spacing={"5px"} color={"black"}>
        <FormControl id='email' isRequired>
            <FormLabel>Email:</FormLabel>
            <Input
                placeholder='Enter your Email'
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password:</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"}>
                    <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        

        <Button
            colorScheme='blue'
            width={"100%"}
            style={{marginTop: 15}}
            onClick={submitHandler}
            isLoading={loading}
        >
            Login
        </Button>
    </VStack>
  )
}

export default Login