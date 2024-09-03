import { Box, Text, Button, Icon } from "@chakra-ui/react";
import { EmailIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

function ForgetSuccess() {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="75vh">
            <Box className='LoginBox' maxW="600px" alignItems="center" p={5}>
                <Text variant="h4" my={2} fontWeight="bold">
                    Email Sent
                </Text>
                <Text variant="h4" my={2} fontWeight="bold" mb={5}>
                    To Your Inbox
                </Text>
                <Text variant="h6" my={2} mb={5}>
                    We have successfully sent the reset link to your email
                </Text>
                {/* insert photo */}
                <Box display="flex" justifyContent="center">
                    <Icon as={EmailIcon} fontSize="150" mb={2} />
                </Box>
                <Box textAlign="center" mb={5} my={2}>
                    <Text variant="h7">
                        Please follow the instructions given
                    </Text>
                </Box>
            </Box>
        </Box>
    );
}

export default ForgetSuccess;