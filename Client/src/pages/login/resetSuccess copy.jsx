import { React, useState, useRef, useEffect, useContext } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import Navbar from "../../components/Navbar/Navbar";
import { Box, Typography, Grid, Button, TextField, Container, FormControl, InputLabel, RadioGroup, FormControlLabel, FormLabel, Radio, FormGroup, Checkbox, FormHelperText } from "@mui/material";
import { Button as ChakraButton } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http.js';
import { ToastContainer, toast } from 'react-toastify';
import '../../css/loginPage.css'
import UserContext from '../../contexts/UserContext.js';



function ResetPassword() {

    const navigate = useNavigate();


    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Box className='LoginBox' sx={{ maxWidth: '600px', alignItems: 'center', padding: 5 }}>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold' }}>
                    Password Successfully
                </Typography>
                <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold', mb: 5 }}>
                    Changed
                </Typography>
                <Typography variant="h6" sx={{ my: 2, mb: 5 }}>
                    We have successfully changed your password
                </Typography>
                {/* insert photo */}
                <Typography variant="h7" sx={{ my: 2, mb: 5 }}>
                    Please return to login page
                </Typography>
                <Button className='submitBox' fullWidth variant="contained" sx={{ mt: 2, mb: 3 }}
                    onClick={() => navigate('/login')}>
                    Sign In
                </Button>
            </Box>
        </Box>
    );
}

export default ResetPassword
