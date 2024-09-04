import { Box, Text, Grid, Button, Container, Icon } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http.js';
import { ToastContainer, toast } from 'react-toastify';
import { LockIcon } from '@chakra-ui/icons';
import { Bold } from "lucide-react";

function ResetPasswordSuccess() {

    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" backgroundImage="url('/blueBG.jpg')"
            backgroundSize="cover"
            backgroundPosition="center">
            <Box maxW="600px" alignItems="center" p={40} backgroundColor="white"
                borderRadius="10px"
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)">
                <Box ml={3} mr={3}>
                    <Text fontSize={32} m={2} pb={7} fontWeight="bold" align={"center"}>
                        Password Successfully Reset!
                    </Text>
                    <Text variant="h6" my={2} mb={5} align={"center"}>
                        We have successfully changed your password
                    </Text>
                    {/* insert photo */}
                    <Box display="flex" justifyContent="center">
                        <Icon as={LockIcon} fontSize="130px" margin={30} />
                    </Box>
                    <Box textAlign="center" mb={5} my={2}>
                        <Text variant="h7">
                            Please return to login page
                        </Text>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Button
                            className='submitBox'
                            w="59%"
                            variant="solid"
                            colorScheme="blue"
                            mt={20}
                            mb={3}
                            padding={12}
                            align={'center'}
                            style={{
                                background: 'linear-gradient(to left, #1DB5E4, #1274CE)',
                            }}
                            color="#fff"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ResetPasswordSuccess;