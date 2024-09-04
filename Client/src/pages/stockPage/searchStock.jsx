import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SearchStockInput from '@/components/stockPage/searchStockInput';
import StableSidebar from '@/components/StableSidebar';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

function SearchStock() {
  const { query } = useParams();
  const navigate = useNavigate();

  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/stocks/searchSymbol?symbol=${query}`);
      const data = response.data.result;

      const filteredStockList = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'Common Stock' && !data[i].symbol.includes('.')) {
          const stockData = await searchSymbol(data[i].symbol);
          if (stockData) { // Only push if stockData is not null
            filteredStockList.push(stockData);
          }
        }
      }
      setStockList(filteredStockList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const searchSymbol = async (symbol) => {
    try {
      const stockResponse = await axios.get(`http://localhost:3000/stocks/stockData?symbol=${symbol}&type=stock&view=5D`);
      const stockArray = stockResponse.data[symbol];
      const latest = stockArray[stockArray.length - 1];
      const currentPrice = latest.c.toFixed(2);

      const yahooResponse = await axios.get(`http://localhost:3000/testing/api/stock/${symbol}`);
      console.log('yahooResponse.data', yahooResponse.data.regularMarketVolume);
      const displayName = yahooResponse.data.displayName;
      const regularMarketChange = yahooResponse.data.regularMarketChange.toFixed(2);
      const regularMarketChangePercent = yahooResponse.data.regularMarketChangePercent.toFixed(2);

      // Return the stock object to be added to the list
      return {
        symbol,
        name: displayName,
        price: currentPrice,
        change: regularMarketChange,
        percent: regularMarketChangePercent,
      };
    } catch (error) {
      console.error(`Error fetching symbol data for ${symbol}:`, error);
      return null; // Return null on failure to prevent adding to the list
    }
  };

  function TableOutput() {
    // Check if stockList contains valid objects
    if (!Array.isArray(stockList) || stockList.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan="4">No data available or failed to fetch.</TableCell>
        </TableRow>
      );
    }

    return stockList.map((stock, index) => (
      <TableRow key={index}>
        <TableCell>{stock.symbol || 'N/A'}</TableCell>
        <TableCell>{stock.name || 'N/A'}</TableCell>
        <TableCell>
          {stock.price || 'N/A'}{' '}
          <span className={`text-sm font-bold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock.change >= 0 ? '+' : ''}{stock.change || 0} ({stock.percent || 0}%)
          </span>
        </TableCell>
        <TableCell className="text-right">
            <Button className="mr-2 bg-blue-500 hover:bg-blue-600" onClick={() => navigate(`/buyStock/${stock.symbol}`)}>Buy</Button>
            <Button className="mr-2 bg-red-500 hover:bg-red-600" onClick={() => navigate(`/sellStock/${stock.symbol}`)}>Sell</Button>
            <Button onClick={() => navigate(`/Stock/${stock.symbol}`)}>View</Button>
        </TableCell>
      </TableRow>
    ));
  }

  return (
    <StableSidebar>
      <div className='Container'>
        <SearchStockInput />
        <span style={{marginLeft:'2rem', fontSize:'1.5rem', fontWeight:'800', marginTop:'1rem'}}>Searching for: {query}</span>
        <Table style={{ maxHeight: '60vh', width: '60vw', marginLeft:'2rem', marginTop: '1.5rem' }}>
          <TableCaption>List of Stocks matching {query}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableOutput />
          </TableBody>
        </Table>
      </div>
    </StableSidebar>
  );
}

export default SearchStock;
