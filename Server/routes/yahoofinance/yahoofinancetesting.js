import express from 'express'
import yahooFinance from 'yahoo-finance2';  // Importing the default export from yahoo-finance2


const yahoofinancetesting = express.Router();

yahoofinancetesting.get('/api/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const quote = await yahooFinance.quote(symbol);  // Using the default export directly
        res.json(quote);
    } catch (error) {
        res.status(500).send('Error fetching stock data');
    }
});

export default yahoofinancetesting;