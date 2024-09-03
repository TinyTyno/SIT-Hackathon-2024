import express from 'express';
import db from '../models/model_index.js';

const QNArouter = express.Router();

QNArouter.get('/qna', async (req, res) => {
    try {
        const Message = await db.Messages.findAll();
        console.log(Message);
        res.json(Message);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

QNArouter.post('/qna', async (req, res) => {
    try {
        console.log(req.body);
        const comment = await db.Messages.create({messages: req.body.messages, date: new Date()});
        res.json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
);

export default QNArouter;