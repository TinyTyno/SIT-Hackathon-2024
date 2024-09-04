import express from "express";
import yahooFinance from "yahoo-finance2";
import WebSocket from "ws";
import finnhub from "finnhub";
import axios from "axios";
import dotenv from "dotenv";

const stockRouter = express.Router();
dotenv.config();

// Get the historical stock data for a specific stock/crypto
//Required parameters: type, symbol, view (e.g. AAPL, stock, 1D)
stockRouter.get("/stockData", async (req, res) => {
  const type = req.query.type;
  const symbol = req.query.symbol;
  const view = req.query.view;

  var interval;
  switch (view) {
    case "1D":
      interval = "1Min";
      break;
    case "5D":
      interval = "5Min";
      break;
    default:
      interval = "1D";
      break;
  }

  // Creating the URI for the request of the stock data
  var uri;
  var options;
  if (type === "crypto") {
    uri = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbol}&timeframe=${interval}&limit=10000&sort=asc`;
    options = {
      method: "GET",
      url: encodeURI(uri),
      headers: { accept: "application/json" },
    };
  } else if (type === "stock") {
    // Setting the start date for the stock data
    let start = new Date();
    switch (view) {
      case "1D":
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() + 1);
        break;
      case "5D":
        start.setDate(start.getDate() - 5);
        break;
      case "1M":
        start.setMonth(start.getMonth() - 1);
        break;
      case "1Y":
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    start = start.toISOString().split("T")[0];

    // Creating the URI for the request of the stock data
    uri = `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&&timeframe=${interval}&start=${start}&limit=10000&adjustment=raw&feed=sip&sort=asc`;
    options = {
      method: "GET",
      url: encodeURI(uri),
      headers: {
        accept: "application/json",
        "APCA-API-KEY-ID": process.env.APCA_API_KEY_ID,
        "APCA-API-SECRET-KEY": process.env.APCA_API_SECRET_KEY,
      },
    };
  } else {
    res.status(400).send(`Invalid type of stock: ${type}`);
  }

  // Fetching the stock data
  try {
    axios
      .request(options)
      .then((response) => {
        res.status(200).send(response.data.bars);
      })
      .catch(function (error) {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send;
  }
});

//Search Symbol
stockRouter.get("/searchSymbol", async (req, res) => {
  const symbol = req.query.symbol;

  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = process.env.FINNHUB_API_KEY;
  const finnhubClient = new finnhub.DefaultApi();

  finnhubClient.symbolSearch(symbol, (error, data, response) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
});

// Get the available traded stocks
stockRouter.get("/availableStocks", async (req, res) => {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = process.env.FINNHUB_API_KEY;
  const finnhubClient = new finnhub.DefaultApi();
  finnhubClient.stockSymbols(
    "US",
    { securityType: "Common Stock" },
    (error, data, response) => {
      console.log("yesh");
      res.status(200).send(data);
    }
  );
});
// get recommendation trends
stockRouter.get("/recommendationTrends", async (req, res) => {
  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = process.env.FINNHUB_API_KEY;
  const finnhubClient = new finnhub.DefaultApi();
  const symbol = req.query.symbol;
  finnhubClient.recommendationTrends(symbol, (error, data, response) => {
    console.log("recommendation trend", data);
    res.status(200).send(data);
  });
});

// get buy and sell history of today for a specific stock
stockRouter.get("/stockActivity", async (req, res) => {
    const apiKey = process.env.APCA_API_KEY_ID; 
    const apiSecret = process.env.APCA_API_SECRET_KEY;
    const symbol = req.query.symbol;
    const start = new Date().toISOString().split('T')[0] + 'T09:30:00Z'; // Start of today's trading day
    const end = new Date().toISOString(); // Current time
    
    const url = `https://data.alpaca.markets/v2/stocks/${symbol}/trades?start=${start}&end=${end}&limit=1000`;
    
    fetch(url, {
      method: 'GET',
      headers: {
        'APCA-API-KEY-ID': apiKey,
        'APCA-API-SECRET-KEY': apiSecret
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('stock activity',data); // Process the trade data to analyze buy/sell activity
      })
      .catch(error => console.error('Error fetching data:', error));
});
export default stockRouter;
