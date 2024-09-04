import { ChakraProvider, Box, Text, Grid, Button, Input, FormLabel, FormControl, FormErrorMessage, Container, IconButton, InputRightElement, InputGroup } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http.js';
import { ToastContainer, toast } from 'react-toastify';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import StableSidebar from '@/components/StableSidebar'



function ResetPassword() {
    const param = useParams()
    const id = param.id
    const token = param.token
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            newPassword: "",
            confirmPassword: ""
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            confirmPassword: yup.string()
                .required('Confirm password is required')
                .oneOf([yup.ref('newPassword')], 'Passwords must match'),
            newPassword: yup.string()
                .required('Password is required')
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .test('hasLetter', 'Password must have at least one letter', val => val && /[a-zA-Z]/.test(val))
                .test('hasNumber', 'Password must have at least one number', val => val && /\d/.test(val))
                .test('hasCapitalLetter', 'Password must have at least one capital letter', val => val && /[A-Z]/.test(val))
                .test('hasSpecialSymbol', 'Password must have at least one special symbol', val => val && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val))
                .notOneOf([yup.ref('currentPassword')], 'New password must not match previous password'),
        }),

        onSubmit: async (data) => {
            console.log(data);
            const newPassword = data.newPassword.trim();

            try {
                await http.post(`/user/reset-password/${id}/${token}`, { newPassword })
                console.log(newPassword)
                console.log("password change success")
                navigate("/resetSuccess")
            } catch (err) {
                if (err.response && err.response.data) {
                    toast.error(err.response.data.message);
                } else {
                    toast.error("An unknown error occurred");
                }
            }
        }
    });


    return (
        <ChakraProvider>
            <StableSidebar>
                <Container maxW="container.lg" p={5} h="100vh" display="flex" flexDirection="column">
                    <Box display="flex" justifyContent="space-between" pt={10}>
                        <Box w="50%" mr={2}>
                            <Text variant="h4" my={2} fontWeight="bold">
                                Reset
                            </Text>
                            <Text variant="h4" my={2} fontWeight="bold" mb={5}>
                                Password
                            </Text>
                            <form onSubmit={formik.handleSubmit}>
                                <FormControl isInvalid={formik.touched.newPassword && Boolean(formik.errors.newPassword)}>
                                    <FormLabel>New Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={formik.values.newPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                                backgroundColor: 'white',
                                                border: '1px solid gray',
                                                borderRadius: '10px',
                                                padding: '10px',
                                            }}
                                        />
                                        <InputRightElement>
                                            <IconButton onClick={handleTogglePassword} size="sm" icon={showPassword ? <ViewIcon /> : <ViewOffIcon />} />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <InputGroup>
                                        <Input
                                            type={confirmShowPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                                backgroundColor: 'white',
                                                border: '1px solid gray',
                                                borderRadius: '10px',
                                                padding: '10px',
                                            }}
                                        />
                                        <InputRightElement>
                                            <IconButton onClick={handleToggleConfirmPassword} size="sm" icon={confirmShowPassword ? <ViewIcon /> : <ViewOffIcon />} />
                                        </InputRightElement>
                                    </InputGroup>
                                    <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
                                </FormControl>
                                <Button type="submit" w="full" mt={2}>
                                    Change Password
                                </Button>
                            </form>
                        </Box>
                        <Box w="40%" ml={5} display="flex" flexDirection="column" justifyContent="center" mt="-10">
                            <Text variant="h6" my={2} fontWeight="bold" mb={5}>
                                Password must contain:
                            </Text>
                            <Box ml={4} textAlign="left">
                                <ul>
                                    <li>
                                        <Text fontSize={16}>
                                            At least 8 characters
                                        </Text>
                                    </li>
                                    <li>
                                        <Text fontSize={16}>
                                            One uppercase letter
                                        </Text>
                                    </li>
                                    <li>
                                        <Text fontSize={16}>
                                            One lowercase letter
                                        </Text>
                                    </li>
                                    <li>
                                        <Text fontSize={16}>
                                            One number
                                        </Text>
                                    </li>
                                    <li>
                                        <Text fontSize={16}>
                                            One special symbol
                                        </Text>
                                    </li>
                                </ul>
                            </Box>
                        </Box>
                    </Box>
                </Container>
            </StableSidebar>
        </ChakraProvider>
    );
}

export default ResetPassword;