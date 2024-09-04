import express from 'express';
import db from '../models/model_index.js';

const QNArouter = express.Router();

// Fetch all Q&A messages
QNArouter.get('/qna', async (req, res) => {
    try {
        const messages = await db.Messages.findAll();
        console.log(messages);
        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Post a new comment (no authentication required)
QNArouter.post('/qna', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages) {
            return res.status(400).json({ message: 'Message is required' }); // Respond with an error if message is missing
        }

        console.log(req.body);

        // Create a new comment without userID
        const comment = await db.Messages.create({
            messages: messages,
            date: new Date(),
            userID: null // Set userID to null or an appropriate default value if not authenticated
        });
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default QNArouter;
