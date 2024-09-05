import {
    ChakraProvider,
    Box,
    Container,
    Text,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Checkbox,
    Flex,
    Grid,
    GridItem,
    Tab,
} from '@chakra-ui/react';
import { React, useState, useCallback, useEffect, useContext, IconButton } from 'react';


import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '@chakra-ui/modal';
import Navbar from '@/components/Navbar'
import StableSidebar from '@/components/StableSidebar'
import '@fontsource/inter';
import http from '../../http.js';
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import UserContext from '../../contexts/UserContext';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bg: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    outline: 'none'
};

function UserView() {
    const { user, setUser } = useContext(UserContext);

    const { id } = useParams(); // get the id from the URL parameter
    const [userInfo, setUserInfo] = useState([]);

    const fetchData = async (id) => {
        await http.get(`/user/${id}`).then((res) => {
            setUserInfo(res.data);
        }).catch((r) => console.log(r))
    };

    useEffect(() => {
        if (user) {
            setUser(user);
            fetchData(id);
        }
    }, [user]); //synchronises it such that only when useContext loads user in, data is fetched

    const navigate = useNavigate()
    const [selected, setSelected] = useState(null);
    const [open, setopen] = useState(false);
    const [openConfirm, setopenConfirm] = useState(false);
    const [selectedUser, setselectedUser] = useState(null)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleOpenConfirmation = () => {
        const temp = []
        for (var i = 0; i < userList.length; i++) {
            for (var j = 0; j < selected.length; j++) {
                if (userList[i].id == selected[j]) {
                    temp.push(userList[i].name)
                }
            }
        }
        setselectedUser(temp)
        setopenConfirm(true)
    }
    const handleCloseConfirmation = () => {
        setopenConfirm(false);
        setSelected(null)
    };
    const handleOpen = () => {
        setopen(true);
    };
    const handleClose = () => {
        setopen(false);
    };
    const Click = (user) => () => {
        navigate(`/user/userUpdate/${user.id}`)
    };

    const onSelectChange = (val) => {
        setSelected(val);
    };

    const deleteUser = () => {
        if (selected.length > 0) {
            selected.forEach((element) => {
                http
                    .delete(`/user/${element}`)
                    .then((res) => {
                        console.log(res.data);
                        setopenConfirm(false);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        }
        fetchData()
    };

    return (
        <>
            <StableSidebar>
                <Container maxW="container.lg" p={4}>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, pl: { xs: 6, md: 0 }, position: "relative" }}
                    >

                        <Box sx={{ maxWidth: "95%", mt: { xs: '5em', lg: 0 }, ml: 10 }}>
                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 4, mt: 1 }}>
                                <Text variant="subtitle1" fontSize="42" fontWeight="bold">
                                    {userInfo.name}
                                </Text>
                                <Link to={`/user/userUpdate/${id}`}>
                                    <Text
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: "bold", color: '#AA3535', textDecoration: 'underline', cursor: 'pointer', mt: 10
                                        }}
                                    >
                                        Edit
                                    </Text>
                                </Link>
                            </Box>
                            <Text variant="subtitle1" fontSize="20" fontWeight="bold">
                                    {userInfo.email}
                                </Text>
                        </Box>
                        {/* box for portfolio and cash balance */}
                        <Container maxW="container.lg" p={5} h="100vh" display="flex" flexDirection="column">
                            <Box display="flex" justifyContent="space-between" pt={10}>
                                {/* portfolio box */}
                                
                                <Box w="70%" mr={2}>

                                </Box>
                                {/* Cash balance box */}
                                <Box w="30%" ml={2}>

                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Container>
            </StableSidebar>
        </>
    );
}

export default UserView;