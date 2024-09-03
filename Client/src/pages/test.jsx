import React, { useEffect } from 'react'
// import yahooFinance from 'yahoo-finance2';

const Test = () => {
// Import the yahoo-finance2 library


// Function to fetch stock data
async function fetchStockData(symbol) {
    try {
        // Fetch the quote data for the given stock symbol
        const quote = await yahooFinance.quote(symbol);
        console.log(quote);
        // Log the fetched data to the console
        console.log(`Symbol: ${quote.symbol}`);
        console.log(`Current Price: ${quote.regularMarketPrice}`);
        console.log(`Previous Close: ${quote.regularMarketPreviousClose}`);
        console.log(`Market Open: ${quote.regularMarketOpen}`);
    } catch (error) {
        // Log any errors encountered during the fetch process
        console.error('Error fetching stock data:', error);
    }
}

async function fetchStockData2(symbol) {
    const quote = await yahooFinance.quote(symbol);
    console.log(quote);
    // console.log(`Symbol: ${quote.symbol}`);
    // console.log(`Current Price: ${quote.regularMarketPrice}`);
    // console.log(`Previous Close: ${quote.regularMarketPreviousClose}`);
    // console.log(`Market Open: ${quote.regularMarketOpen}`);
    console.log('-----------------------------')
}

// Example usage: Fetch data for Apple Inc. (AAPL)
// fetchStockData2('C6L.SI');

useEffect(() => {
    setInterval(()=>fetchStockData2("Z74.SI"), 2000);
},[]);

  return (
    <div>
      hello
    </div>
  )
}

export default Test

