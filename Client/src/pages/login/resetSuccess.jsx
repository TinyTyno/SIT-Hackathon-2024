import { Box, Text, Grid, Button, Container, Icon } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http.js';
import { ToastContainer, toast } from 'react-toastify';
import { LockIcon } from '@chakra-ui/icons';

function ResetPasswordSuccess() {

    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" mt={12}>
            <Box className='LoginBox' maxW="700px" alignItems="center" p={7}>
                <Box ml={3} mr={3}>
                    <Text variant="h4" my={2} fontWeight="bold">
                        Password Successfully
                    </Text>
                    <Text variant="h4" my={2} fontWeight="bold" mb={5}>
                        Reset
                    </Text>
                    <Text variant="h6" my={2} mb={5}>
                        We have successfully changed your password
                    </Text>
                    {/* insert photo */}
                    <Box display="flex" justifyContent="center">
                        <Icon as={LockIcon} fontSize="150px" />
                    </Box>
                    <Box textAlign="center" mb={5} my={2}>
                        <Text variant="h7">
                            Please return to login page
                        </Text>
                    </Box>
                    <Button className='submitBox' w="full" variant="solid" colorScheme="blue" mt={2} mb={3}
                        onClick={() => navigate('/login')}>
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ResetPasswordSuccess;