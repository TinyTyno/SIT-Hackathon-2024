import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from '../../http'; // Import your HTTP client here

function QuestionArea() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);

    const fetchQNA = async () => {
        try {
            const response = await http.get("/comment/qna");
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchQNA();
    }, []);

    const formik = useFormik({
        initialValues: {
            messages: "",
        },
        validationSchema: yup.object({
            messages: yup.string().required("Comment is required"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await http.post("/comment/qna", { messages: values.messages });
                setMessages([...messages, response.data]); // Update the comments list
                resetForm(); // Clear the form after submission
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <div>
            <h2>Message Board</h2>

            {/* Form to add a new comment */}
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <textarea
                        name="messages"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.messages}
                        placeholder="Type your comment here..."
                    />
                    {formik.touched.messages && formik.errors.messages ? (
                        <div>{formik.errors.messages}</div>
                    ) : null}
                </div>
                <button type="submit">Submit</button>
            </form>

            {/* Display the comments */}
            <div>
                <h3>Comments</h3>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <div key={index}>
                            <p><strong>Message:</strong> {message.messages}</p>
                            
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
}

export default QuestionArea;