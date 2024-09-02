import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './models/model_index.js';



// Create express app
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL
}));

app.use(express.json());

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

import QNArouter from './routes/Comments.js';
app.use('/comment', QNArouter);


// Initialising database & server
let port = process.env.SERVER_PORT;
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Connected to the database');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.log('Error connecting to the database', error);
})