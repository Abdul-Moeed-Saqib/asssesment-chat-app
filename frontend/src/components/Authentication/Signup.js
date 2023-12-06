import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios  from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState(false)

    const toast = useToast()
    const navigate = useNavigate();

    const handleClick = () => setShow(!show);

    const postDetails = (pic) => {
        setLoading(true);
        if (pic === undefined) {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });
              setLoading(false);
              return;
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset", "mern-app");
            data.append("cloud_name", "danvxaxkx");
            axios.post("https://api.cloudinary.com/v1_1/danvxaxkx/image/upload", data
            )
            .then(response => {
                setPic(response.data.url.toString());
                console.log(response.data.url.toString());
                setLoading(false);
                toast({
                    title: 'Uploaded successfully!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                  });
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
            });
        } else {
            toast({
                title: 'Please Select an Image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });
              setLoading(false);
              return;
        }
    };

    const submitHandler =  async () => {
        setLoading(true);

        if (!name || !email || !password || !confirmPassword) {
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

        if (password !== confirmPassword) {
            toast({
                title: 'The Password is not matching',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post("/api/user", { name, email, password, pic}, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            toast({
                title: 'The account has been created!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
              });

            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
            
        } catch (error) {
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
        <FormControl id='first-name' isRequired>
            <FormLabel>Name:</FormLabel>
            <Input
                placeholder='Enter your Name'
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
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
        <FormControl id='confirm-password' isRequired>
            <FormLabel>Confirm Password:</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    placeholder='Confirm Password'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <InputRightElement width={"4.5rem"}>
                    <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload your Picture:</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>

        <Button
            colorScheme='blue'
            width={"100%"}
            style={{marginTop: 15}}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup