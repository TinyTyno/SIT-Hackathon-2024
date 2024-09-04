import React, { useContext, useState } from 'react';
import { Box, Text, Input, Button, Container, Flex } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../contexts/UserContext';
import Navbar from '@/components/Navbar'
import StableSidebar from '@/components/StableSidebar'


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
        <>
            <Navbar role={"user"} />
            <Box mt={16} display="flex" flexDirection="column" alignItems="center">
                <Box className='LoginBox' maxW="600px" alignItems="center" p={5}>
                    <Text fontSize="xl" fontWeight="bold" mb={2}>
                        Forgot Your
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Password?
                    </Text>
                    <Text fontSize="sm" mb={4}>
                        We will send a Password Reset link to your email
                    </Text>
                    <Box as="form" maxW="500px" alignItems="center" mt={2} onSubmit={formik.handleSubmit}>
                        <Input
                            type="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.email && Boolean(formik.errors.email)}
                            errorBorderColor="red.300"
                            placeholder="Email"
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <Text fontSize="sm" color="red.300">
                                {formik.errors.email}
                            </Text>
                        ) : null}

                        <Button
                            className='submitBox'
                            w="full"
                            variant="solid"
                            colorScheme="blue"
                            mt={2}
                            mb={3}
                            type="submit"
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
                <ToastContainer />
            </Box>
        </>
    );
}

export default ForgotPassword;