import React, { useState, useEffect, useRef, useContext } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../../http'; // Import your HTTP client here
import {
    Box,
    Container,
    Typography,
    TextField,
    InputAdornment,
    Avatar,
    Paper,
    IconButton,
    Fab,
} from '@mui/material';
import { IoSend } from 'react-icons/io5';
import { FaArrowDown } from 'react-icons/fa'; // Icon for scroll-to-bottom button
import { motion } from 'framer-motion'; // Import framer-motion for animations
import StableSidebar from '@/components/StableSidebar';
import UserContext from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

function QuestionArea() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const chatEndRef = useRef(null); // Reference to the end of the chat box
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    // Fetch messages for Q&A
    const fetchQNA = async () => {
        try {
            const response = await http.get('/comment/qna');
            setMessages(response.data);
            scrollToBottom(); // Scroll to bottom when messages are loaded
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(user){
            fetchQNA(); // Fetch messages when component mounts
            setLoading(false);
        }
        else if(!user && !loading){
            navigate('/login');	
        }
    }, [user,loading,navigate]);

    const formik = useFormik({
        initialValues: {
            messages: '',
        },
        validationSchema: yup.object({
            messages: yup.string().required('Comment is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                // Post message even if user is not authenticated
                const response = await http.post('/comment/qna', { messages: values.messages });
                setMessages((prevMessages) => [...prevMessages, response.data]);
                resetForm();
                scrollToBottom(); // Scroll to bottom when a new message is added
            } catch (error) {
                console.error(error);
            }
        },
    });

    // Function to scroll to the bottom of the chat box
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <div>
        <StableSidebar>
        <Box
            display="flex"
            flexDirection="column"
            sx={{ backgroundColor: 'white', position: 'relative' }}
        >
            <Container sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
                <Typography variant="h5" sx={{ marginBottom: 3,  color: 'black',paddingLeft:2, paddingTop:'1em',fontWeight:'bold' }}>
                    Q&A Board
                </Typography>

                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    display="flex"
                    flexDirection="column"
                    sx={{ flex: 1, overflowY: 'auto', padding: 2 }}
                >
                    {/* Messages display area */}
                    {messages.length > 0 ? (
                        messages.map((message) => {
                            const messageDate = new Date(message.date);
                            const date = messageDate.toLocaleDateString();
                            const time = messageDate.toLocaleTimeString();
                            const userAvatar = '/default-avatar.png'; // Default avatar for all users

                            return (
                                <Paper
                                    key={message.id}
                                    component={motion.div}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    elevation={3}
                                    sx={{ 
                                        marginBottom: 2, 
                                        padding: 2, 
                                        borderRadius: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: '#DDE7F5',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            fontSize: '0.75rem',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {date}
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: 1,
                                        }}
                                    >
                                        <Avatar
                                            src={userAvatar}
                                            sx={{ width: 40, height: 40, marginRight: 1 }}
                                        />
                                        <Typography variant="body2" fontWeight="bold">
                                            {/* Display a default name or leave empty */}
                                            Anonymous
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ marginBottom: 0.5, color: '#555' }}>
                                        {message.messages}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {time}
                                    </Typography>
                                </Paper>
                            );
                        })
                    ) : (
                        <Typography variant="body1" sx={{ color: '#777' }}>
                            No comments yet. Be the first to comment!
                        </Typography>
                    )}
                    <div ref={chatEndRef} /> {/* Empty div for scrolling to bottom */}
                </Box>

                {/* Scroll-to-bottom button */}
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        right: 16,
                    }}
                    onClick={scrollToBottom}
                >
                    <FaArrowDown />
                </Fab>

               
            </Container>
             {/* Form at the bottom */}
             <Box
                    component="form"
                    display="flex"
                    alignItems="center"
                    onSubmit={formik.handleSubmit}
                    sx={{
                        padding: 2,
                        backgroundColor: '#ffffff',
                        borderTop: '1px solid #ddd',
                        position: 'sticky',
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Type a comment"
                        variant="outlined"
                        name="messages"
                        value={formik.values.messages}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.messages && Boolean(formik.errors.messages)}
                        helperText={formik.touched.messages && formik.errors.messages}
                        sx={{
                            borderRadius: '20px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '20px',
                            }
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        type="submit"
                                        color="primary"
                                    >
                                        <IoSend
                                            style={{
                                                fontSize: '24px',
                                            }}
                                        />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
        </Box>
        </StableSidebar>
      </div>
    );
}

export default QuestionArea;

