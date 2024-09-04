import express from "express";
import yahooFinance from "yahoo-finance2"; // Importing the default export from yahoo-finance2
import axios from "axios";
import pLimit from 'p-limit'

const yahoofinancetesting = express.Router();
const limit = pLimit(5)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchStockDataWithDelay = async (symbol) => {
    const randomDelay = Math.floor(Math.random() * 1000) + 500; // Random delay between 500ms and 1500ms
    await delay(randomDelay); // Wait for the random delay
  
    try {
      const stockData = await yahooFinance.quote(symbol);
      console.log(`Fetched data for ${symbol} after ${randomDelay}ms delay`);
      return stockData;
    } catch (error) {
      console.error(`Failed to fetch data for ${symbol}: ${error.message}`);
      return null;
    }
  };

yahoofinancetesting.get("/api/stock/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  try {
    const quote = await yahooFinance.quote(symbol); // Using the default export directly
    res.json(quote);
  } catch (error) {
    res.status(500).send("Error fetching stock data");
  }
});

// yahoofinancetesting.get("/api/trendingStocks", async (req, res) => {
//     let allStocks = [];
//   try {
//     const response = await axios.get(
//       `http://localhost:3000/stocks/availableStocks`)
//       const promises = response.data.map(symbol => 
//         limit(() => fetchStockDataWithDelay(symbol))
//       );
//       const results = await Promise.all(promises);
//     allStocks.push(results);
//     console.log(allStocks.length);
//   } catch (error) {
//     res.status(500).send("Error fetching stock data");
//   }
// });

export default yahoofinancetesting;
