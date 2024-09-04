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


//Routes
// Stocks
import stockRouter from './routes/Stocks.js';
app.use('/stocks', stockRouter);
// import searchRouter from './routes/Search.js';
// app.use('/api', searchRouter);
import StockTransactionRouter from './routes/StockTransaction.js';
app.use('/transactions', StockTransactionRouter);
import yahoofinancetesting from './routes/yahoofinance/yahoofinancetesting.js';
app.use('/testing', yahoofinancetesting);

//user
import userRouter from './routes/User.js';
app.use('/user', userRouter)



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