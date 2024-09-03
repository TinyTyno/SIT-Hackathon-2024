import express from 'express';
import yahooFinance from 'yahoo-finance2';
import WebSocket from 'ws';
import finnhub from 'finnhub';
import axios from 'axios';
import dotenv from 'dotenv';


const stockRouter = express.Router();
dotenv.config();

// Get the historical stock data for a specific stock/crypto
//Required parameters: type, symbol, view (e.g. AAPL, stock, 1D)
stockRouter.get('/stockData', async (req, res) => {
    const type = req.query.type;
    const symbol = req.query.symbol;
    const view = req.query.view;

    var interval;
    switch (view) {
        case '1D':
            interval = '1Min';
            break;
        case '5D':
            interval = '5Min';
            break;
        default:
            interval = '1D';
            break;
    }

    // Creating the URI for the request of the stock data
    var uri;
    var options;
    if (type === 'crypto') {
        uri = `https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${symbol}&timeframe=${interval}&limit=10000&sort=asc`
        options = {
            method: 'GET',
            url: encodeURI(uri),
            headers: { accept: 'application/json' }
        };
    }
    else if (type === 'stock') {
        // Setting the start date for the stock data
        let start = new Date();
        switch (view) {
            case '1D':
                start.setHours(0, 0, 0, 0);
                start.setDate(start.getDate() + 1);
                break;
            case '5D':
                start.setDate(start.getDate() - 5);
                break;
            case '1M':
                start.setMonth(start.getMonth() - 1);
                break;
            case '1Y':
                start.setFullYear(start.getFullYear() - 1);
                break;
        }

        // Creating the URI for the request of the stock data
        uri = `https://data.alpaca.markets/v2/stocks/bars?symbols=${symbol}&&timeframe=${interval}&start=${start}&limit=10000&adjustment=raw&feed=sip&sort=asc`
        options = {
            method: 'GET',
            url: 'https://data.alpaca.markets/v2/stocks/bars?symbols=AAPL&timeframe=1T&start=2024-01-01&limit=1000&adjustment=raw&feed=sip&sort=asc',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': process.env.APCA_API_KEY_ID,
                'APCA-API-SECRET-KEY': process.env.APCA_API_SECRET_KEY
            }
        };
    }
    else {
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
        res.status(500).send
    }
});


export default stockRouter;