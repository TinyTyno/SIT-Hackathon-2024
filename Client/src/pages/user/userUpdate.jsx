import { Box, Flex, Grid, Button, Input, FormLabel, FormControl, FormErrorMessage, RadioGroup, Radio, Checkbox, IconButton, Container } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http'
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Navbar from '@/components/Navbar'
import StableSidebar from '@/components/StableSidebar'
import UserContext from '../../contexts/UserContext';
import { React, useState, useRef, useEffect, useContext } from 'react'


function UserUpdate() {
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
            setName(res.data.name);
            setEmail(res.data.email);
            console.log(res.data)
        });
    }


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');


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
            name: name,
            email: email,
        },
        enableReinitialize: true,
        validationSchema: yup.object({
            name: yup.string().required("User Name is required"),
            email: yup.string().required("Email is required")
        }),

        onSubmit: async (data) => {
            console.log(data);
            data.name = data.name.trim();
            data.email = data.email.trim();

            await http
                .put(`/user/${id}`, data, user)
                .then((res) => {
                    navigate(`/user/userView/${user.id}`)
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });


  return (
    <Box>
      <Navbar></Navbar>
      <Container maxW="container.lg" p={4}>
        <ToastContainer />
          {!loading && (
            <Grid templateColumns="repeat(1, 1fr)" gap={4}>
              <Box w="100%" p={4} bg="white" borderRadius="lg" boxShadow="lg">
                <form onSubmit={formik.handleSubmit}>
                  <FormControl isInvalid={formik.errors.name && formik.touched.name}>
                    <FormLabel>Name *</FormLabel>
                    <Input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid gray',
                        borderRadius: '10px',
                        padding: '10px',
                    }}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={formik.errors.email && formik.touched.email}>
                    <FormLabel>Email *</FormLabel>
                    <Input
                      type="text"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid gray',
                        borderRadius: '10px',
                        padding: '10px',
                    }}
                    />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>

                  <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="lg"
                    fontSize="md"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </form>
              </Box>
            </Grid>
          )}
      </Container>
    </Box>
  );
}

export default UserUpdate;