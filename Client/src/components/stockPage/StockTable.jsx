import { useState, useEffect,useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Adjust the import path
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StockTable = ({ data, itemsPerPage = 10,type='stock' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const navigate = useNavigate();

  const totalPages = Math.ceil(data.length / itemsPerPage);


  // Memoize paginated data to avoid recalculation on every render
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, data]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const searchSymbol = async (symbol) => {
    try {
      const stockResponse = await axios.get(`http://localhost:3000/stocks/stockData?symbol=${symbol}&type=stock&view=5D`);
      const stockArray = stockResponse.data[symbol];
      if(stockArray){
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
      }
      else{
        return null
      }

      
    } catch (error) {
      console.error(`Error fetching symbol data for ${symbol}:`, error);
      return null; // Return null on failure to prevent adding to the list
    }
  };

  const fetchData = async () => {
    var stockList = []
    for(let i=0;i<paginatedData.length;i++){
      const stockData = await searchSymbol(paginatedData[i]);
      if (stockData) { // Only push if stockData is not null
        stockList.push(stockData);
      }
    }
    console.log('stockList',stockList)
    setCurrentData(stockList)
  };
  useEffect(() => {
    setCurrentData(paginatedData);
    fetchData();
  }
  , [paginatedData]);
  return (
    <div>
      <Table className="">
        <TableCaption>All available stocks.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((stock) => (
             <TableRow key={stock.symbol}>
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
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls with Shadcn */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>

         
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default StockTable;
