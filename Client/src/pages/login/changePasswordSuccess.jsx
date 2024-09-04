import { Box, Text, Button, Icon } from "@chakra-ui/react";
import { LockIcon } from '@chakra-ui/icons';
import { React, useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

function ChangePasswordSuccess() {
    const navigate = useNavigate();

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="85vh">
            <Box className='LoginBox' maxW="600px" p={5}>
                <Box ml={2} mr={2}>
                    <Text variant="h4" my={2} fontWeight="bold">
                        Password Successfully
                    </Text>
                    <Text variant="h4" my={2} fontWeight="bold" mb={3}>
                        Changed
                    </Text>
                    <Text variant="h6" my={2} mb={5}>
                        We have successfully changed your password
                    </Text>
                    {/* insert photo */}
                    <Box display="flex" justifyContent="center">
                        <Icon as={LockIcon} fontSize="150" mb={2} />
                    </Box>

                    <Button className='submitBox' w="full" variant="solid" colorScheme="blue" mt={2} mb={3}
                        onClick={() => navigate('/')}>
                        Return to Homepage
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ChangePasswordSuccess;