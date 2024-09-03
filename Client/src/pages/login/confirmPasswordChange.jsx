import { Box, Text, Grid, Button, FormControl, FormLabel, Input, FormErrorMessage, Link } from "@chakra-ui/react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http.js';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from '../../contexts/UserContext.js';
import { ChakraProvider } from '@chakra-ui/react';
import { Navigate, useParams } from 'react-router-dom';

function ConfirmPasswordChange() {
    const { user, setUser } = useContext(UserContext);
    const param = useParams()
    const id = param.id

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
    const [confirmPassword, setConfirmPassword] = useState('');

    const formStyle = {
        marginY: 2,
        borderRadius: 5
    };


    const [error, setError] = useState(false);


    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(-1);
    };

    const formik = useFormik({
        initialValues: {
            newPassword: "",
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            password: yup.string()
                .required('Confirm password is required')
                .oneOf([yup.ref('newPassword')], 'Passwords must match'),
            }),

        onSubmit: async (data) => {
            console.log(data);
            const confirmPassword = data.confirmPassword.trim();
            if (confirmPassword === password)
            {
                console.log("password matches")
                navigate(`changePassword/${id}`)
            }

            // Update the user's current password to the new password
            setUser({ ...user, password: newPassword });

            await http
                .put(`/user/${id}`, { password: newPassword })
                .then((res) => {
                    console.log(res.data);
                    navigate("/resetSuccess")
                })
                .catch(function (err) {
                    toast.error(err.response.data.message);
                });
        }
    });


    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
            <Box className='LoginBox' maxW="600px" alignItems="center" p={5}>
                <Text variant="h4" my={2} fontWeight="bold">
                    Change
                </Text>
                <Text variant="h4" my={2} fontWeight="bold" mb={2}>
                    Password
                </Text>
                <Text variant="h7" my={2} mb={5}>
                    Please key in your current password
                </Text>
                <Box as="form" onSubmit={formik.handleSubmit}>
                    <FormControl isInvalid={formik.touched.newPassword && Boolean(formik.errors.newPassword)}>
                        <FormLabel>New Password</FormLabel>
                        <Input
                            type="password"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <FormErrorMessage>{formik.errors.newPassword}</FormErrorMessage>
                    </FormControl>
                    <Button className='submitBox' w="full" variant="solid" colorScheme="blue" mt={2} mb={3}
                        type="submit">
                        Confirm
                    </Button>
                    <Link to="/login" sx={{
                        color: '#AA3535',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}>
                        Cancel
                    </Link>
                </Box>
                <ToastContainer />
            </Box>
        </Box>
    );
}

export default ConfirmPasswordChange;