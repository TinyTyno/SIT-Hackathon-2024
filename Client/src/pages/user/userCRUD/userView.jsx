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
import http from '../../../http.js';
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import UserContext from '../../../contexts/UserContext';

function DeleteToolbar(props) {
    const { selected, handleOpenConfirmation, handleOpen } = props;
    const handleDelete = () => {
        console.log("data", selected);
        if (selected !== null) {
            handleOpenConfirmation();
        } else {
            handleOpen()
        }
    };

    return (
        <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            <Button colorScheme="red" onClick={handleDelete}>
                Delete
                <DeleteIcon />
            </Button>
        </Grid>
    );
}

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
            <Navbar />
            <StableSidebar>
                <Container maxW="container.lg" p={4}>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, pl: { xs: 6, md: 0 }, position: "relative" }}
                    >

                        <Box sx={{ maxWidth: 700, mt: { xs: '5em', lg: 0 } }}>
                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', mb: 4, mt: 1 }}>
                                <Text variant="subtitle1" sx={{ textTransform: "uppercase", pb: 2, fontWeight: "bold", flexGrow: 1 }}>
                                    Account Information
                                </Text>
                                <Link to={`/user/userUpdate/${id}`}>
                                    <Text
                                        component="span"
                                        variant="subtitle1"
                                        sx={{
                                            pb: 2, fontWeight: "bold", color: '#AA3535', textDecoration: 'underline', cursor: 'pointer'
                                        }}
                                    >
                                        Edit
                                    </Text>
                                </Link>
                            </Box>
                            <Table sx={{ pb: 10, width: '100%', mb: 4 }}>
                                <Thead>
                                    <Th textAlign="left">Name</Th>
                                    <Th textAlign="left">Email</Th>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td textAlign="left">{userInfo?.name}</Td>
                                        <Td textAlign="left">{userInfo?.email}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box>
                    </Box>
                </Container>
            </StableSidebar>
        </>
    );
}

export default UserView;