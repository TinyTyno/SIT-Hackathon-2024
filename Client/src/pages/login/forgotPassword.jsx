import React, { useContext, useState } from 'react';
import { Box, Text, FormControl, Input, InputRightElement, Button, IconButton, FormLabel, FormErrorMessage, InputGroup, ChakraProvider, Container } from "@chakra-ui/react";
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState();

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: yup.object({
            email: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
        }),
        onSubmit: (values, { setSubmitting }) => {
            http.post("/user/forgot-password", values)
                .then((res) => {
                    console.log('Response:', res);

                    if (res && res.data) {
                        if (res.data.Status === "User does not exist") {
                            toast.error("No such email exists in our userbase")
                        } else {
                            navigate('/forgetSuccess');
                        }
                    } else {
                        toast.error('Error: Unable to process request');
                    }
                    setSubmitting(false); // Call setSubmitting here
                })
                .catch((err) => {
                    console.error('Error:', err);
                    if (err && err.response) {
                        if (err.response.data) {
                            toast.error(`Error: ${err.response.data.error}`);
                        } else {
                            toast.error(`Error: ${err.response.status} - ${err.response.statusText}`);
                        }
                    } else {
                        toast.error('Error: Unable to process request');
                    }
                    setSubmitting(false); // Call setSubmitting here
                });
        }
    });


    return (
        <ChakraProvider padding={0}>
            <Container
                maxW={'100%'}
                padding={0}
                minHeight={'100vh'} // Add this line
            >
                <Box display="flex" justifyContent="space-between">
                <Box w="60%" mr={2} style={{
                        backgroundImage: 'url(/virtuetrade.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100vh',
                    }} />
                    <Box w="40%" m={6} mr={8} pt={170}>
                        <Box justifyContent="center" width='90%'>
                            <Text my={2} fontSize={32} fontWeight="bold" mb={2}>
                                Forgot Your
                            </Text>
                            <Text my={2} fontSize={32} fontWeight="bold" mb={4}>
                                Password?
                            </Text>
                            <Text fontSize={16} mb={4}>
                                We will send a Password Reset link to your email
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

                                <Button className='submitButton' type="submit" w="full" mt={2}>
                                    Send
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </ChakraProvider>

    );
}

export default ForgotPassword;