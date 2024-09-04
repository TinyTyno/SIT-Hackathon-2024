import { React, useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import StableSidebar from '@/components/StableSidebar'
import { ChakraProvider, Box, Text, Grid, Button, Input, FormLabel, FormControl, FormErrorMessage, Container, IconButton } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http.js';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext.js';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';


function ChangePassword() {
    const { user, setUser } = useContext(UserContext);
    const param = useParams()
    const id = param.id
    const role = user && user?.userStaff === 'staff' ? 'staff' : undefined;

    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);


    const handleTogglePassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleCurrentPassword = () => {
        setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleToggleConfirmPassword = () => {
        setConfirmShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const [loading, setLoading] = useState(true);

    //Fetching Data
    useEffect(() => {
        if (user) {
            fetchData();
            setUser(user)
            setLoading(false);
        }
    }, []);

    const fetchData = async () => {
        await http.get(`/user/${id}`).then((res) => {
            setPassword(res.data.password)
            console.log(res.data)
        });
    }


    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');



    const formStyle = {
        marginY: 2,
        borderRadius: 5
    };


    const [error, setError] = useState(false);


    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            currentPassword: yup.string()
                .required('Confirm password is required'),
            newPassword: yup.string()
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
                .oneOf([yup.ref('newPassword')], 'Passwords must match')
        }),

        onSubmit: async (data) => {
            try {
                console.log(data)
                // Send the data to the server for verification
                const response = await http.post('/user/change-password', {
                    id: user.id,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                });

                if (response.data.Status === "Password changed successfully") {
                    // Password changed successfully, navigate to success page
                    console.log("Success")
                    navigate("/changePasswordSuccess");
                } else {
                    toast.error(response.data.Status);
                }
            } catch (error) {
                toast.error(error.response.data.Status);
            }
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
                                    Change
                                </Text>
                                <Text variant="h4" my={2} fontWeight="bold" mb={5}>
                                    Password
                                </Text>
                                <form onSubmit={formik.handleSubmit}>
                                    <FormControl isInvalid={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}>
                                        <FormLabel>Current Password</FormLabel>
                                        <Input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={formik.values.currentPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            style={{
                                                backgroundColor: 'white',
                                                border: '1px solid gray',
                                                borderRadius: '10px',
                                                padding: '10px',
                                            }}
                                        />
                                        <IconButton onClick={handleToggleCurrentPassword} size="sm" icon={showCurrentPassword ? <ViewIcon /> : <ViewOffIcon />} />
                                        <FormErrorMessage>{formik.errors.currentPassword}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={formik.touched.newPassword && Boolean(formik.errors.newPassword)}>
                                        <FormLabel>New Password</FormLabel>
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
                                        <IconButton onClick={handleTogglePassword} size="sm" icon={showPassword ? <ViewIcon /> : <ViewOffIcon />} />
                                        <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}>
                                        <FormLabel>Confirm Password</FormLabel>
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
                                        <IconButton onClick={handleToggleConfirmPassword} size="sm" icon={confirmShowPassword ? <ViewIcon /> : <ViewOffIcon />} />
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

export default ChangePassword;