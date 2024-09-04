import { useState, useContext } from 'react';
import { Box, Text, FormControl, Input, InputRightElement, Button, IconButton, FormLabel, FormErrorMessage, InputGroup,ChakraProvider, Container } from "@chakra-ui/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext';
import Navbar from '@/components/Navbar'
import StableSidebar from '@/components/StableSidebar'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .test('hasLetter', 'Password must have at least one letter', val => val && /[a-zA-Z]/.test(val))
                .test('hasNumber', 'Password must have at least one number', val => val && /\d/.test(val))
                .test('hasCapitalLetter', 'Password must have at least one capital letter', val => val && /[A-Z]/.test(val))
                .test('hasSpecialSymbol', 'Password must have at least one special symbol', val => val && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
                .notOneOf([yup.ref('currentPassword')], 'New password must not match previous password'),
        }),
        onSubmit: (data) => {
            data.email = data.email.trim().toLowerCase();
            data.password = data.password.trim();
            console.log(data);
        
            http.post("/user/login", data)
                .then((res) => {
                    console.log(res);
                    localStorage.setItem("accessToken", res.data.accessToken);
                    const userInfo = res.data.user;
                    setUser(userInfo);
                    navigate('/dashboard');
                    window.location.reload();
                })
                .catch((err) => {
                    console.error(err.config.headers);
                    console.error(err);
                    if (err.response) {
                        console.error(err.response.data);
                        if (err.response.data.message === 'Invalid email or password') {
                            toast.error('Invalid email or password');
                        } else {
                            toast.error(`${err.response.data.message}`);
                        }
                    } else {
                        toast.error('An unknown error occurred');
                    }
                });
        }
    });


    return (
        <ChakraProvider>
            <StableSidebar>
                <Container
                    maxW="container.lg" p={5}
                    h="100vh" // full screen height
                    display="flex"
                    flexDirection="column"
                // justifyContent="center"
                // alignItems="center"
                >
                    <Box display="flex" justifyContent="space-between" pt={10}>
                        <Box w="50%" mr={2}>
                            <Text variant="h4" my={2} fontWeight="bold">
                                Sign Into
                            </Text>
                            <Text variant="h4" my={2} fontWeight="bold" mb={5}>
                                Your Account
                            </Text>
                            <form onSubmit={formik.handleSubmit}>
                                <FormControl isInvalid={formik.errors.email && formik.touched.email}>
                                    <FormLabel>Email *</FormLabel>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        style={{
                                            backgroundColor: 'white',
                                            border: '1px solid gray',
                                            borderRadius: '10px',
                                            padding: '10px',
                                        }}
                                    />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={formik.errors.password && formik.touched.password}>
                                    <FormLabel>Password *</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                                backgroundColor: 'white',
                                                border: '1px solid gray',
                                                borderRadius: '10px',
                                                padding: '10px',
                                            }}
                                        />
                                        <InputRightElement width="4.5rem">
                                        <IconButton
                                                onClick={handleTogglePassword}
                                                size="sm"
                                                icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                            />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
                                </FormControl>

                                <Box display="flex" justifyContent="space-between" mb={4} mt={1}>
                                    <Link to="/forgotPassword" color="#AA3535" textDecoration="underline" cursor="pointer">
                                        Forgot Password?
                                    </Link>
                                    <Link to="/user/userCreate" color="#AA3535" textDecoration="underline" cursor="pointer">
                                        Don't have an Account?
                                    </Link>
                                </Box>

                                <Button type="submit" w="full" mt={2}>
                                    Login
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Container>
            </StableSidebar>
        </ChakraProvider>
    );
}

export default Login;