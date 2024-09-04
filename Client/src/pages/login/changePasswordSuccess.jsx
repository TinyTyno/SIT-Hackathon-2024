import { Box, Text, Button, Icon } from "@chakra-ui/react";
import { LockIcon } from '@chakra-ui/icons';
import { React, useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

function ChangePasswordSuccess() {
    const navigate = useNavigate();

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh" backgroundImage="url('/blueBG.jpg')"
            backgroundSize="cover"
            backgroundPosition="center">
            <Box maxW="600px" alignItems="center" p={40} backgroundColor="white"
                borderRadius="10px"
                boxShadow="0px 0px 10px rgba(0, 0, 0, 0.1)">
                <Text fontSize={32} my={2} fontWeight="bold" align={"center"}>
                    Password Successfully Changed
                </Text>
                <Text align={'center'} my={2} mb={5}>
                    We have successfully changed your password
                </Text>
                {/* insert photo */}
                <Box display="flex" justifyContent="center">
                    <Icon as={LockIcon} fontSize="130px" margin={30} />
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
                        onClick={() => navigate('/dashboard')}
                    >
                        Return to Homepage
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ChangePasswordSuccess;