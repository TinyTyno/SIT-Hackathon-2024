import { useState, useContext } from 'react';
import { Box, Text, FormControl, Input, InputRightElement, Button, IconButton, FormLabel, FormErrorMessage, InputGroup, ChakraProvider, Container } from "@chakra-ui/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import UserContext from '../../contexts/UserContext';
import '../../loginCSS/signinLogin.css'


function UserCreate() {
    const navigate = useNavigate();
    const { userID, setUserID } = useContext(UserContext);

    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleConfirmPassword = () => {
        setConfirmShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: yup.object({
            name: yup.string().required('User Name is required'),
            email: yup.string().required('Email is required'),
            password: yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .test('hasLetter', 'Password must have at least one letter', val => val && /[a-zA-Z]/.test(val))
                .test('hasNumber', 'Password must have at least one number', val => val && /\d/.test(val))
                .test('hasCapitalLetter', 'Password must have at least one capital letter', val => val && /[A-Z]/.test(val))
                .test('hasSpecialSymbol', 'Password must have at least one special symbol', val => val && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
                .notOneOf([yup.ref('currentPassword')], 'New password must not match previous password'),
            confirmPassword: yup.string()
                .required('Confirm password is required')
                .oneOf([yup.ref('password')], 'Passwords must match'),
        }),

        onSubmit: (data) => {
            console.log(data);
            data.name = data.name.trim();
            data.email = data.email.trim();
            data.password = data.password.trim();

            http.post('/user/create', data)
                .then((res) => {
                    console.log(res); // Log the entire response object
                    if (res.data) { // Check if res.data exists
                        console.log(res.data);
                        localStorage.setItem('accessToken', res.data.accessToken);
                        navigate('/login');
                    } else {
                        console.log('No data in response');
                    }
                })
                .catch((err) => {
                    toast.error(`${err.response.data.message}`);
                });
        },
    });


    return (
        <ChakraProvider padding={0}>
            <Container
                maxW={'100%'}
                padding={0}
            >
                <Box display="flex" justifyContent="space-between">
                    <Box w="60%" h='100%' mr={2}>
                        <img src="signUp.jpg" alt=""  />
                    </Box>
                    <Box w="40%" m={6} mr={8} pt={170}>
                        <Box  justifyContent="center" width='90%'> 
                            <Text variant="h4" my={2} fontSize={32} fontWeight="bold" mb={5}>
                                Sign Up
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
                                    {/* <Link to="/user/userCreate" color="#AA3535" textDecoration="underline" cursor="pointer">
                                        Don't have an Account?
                                    </Link> */}
                                </Box>

                                <Button className='submitButton' type="submit" w="full" mt={2}>
                                    Sign Up
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ChakraProvider>
    );
}

export default UserCreate;