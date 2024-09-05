import { Search } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import UserContext from '@/contexts/UserContext';
import http from '@/http';
import { Skeleton } from "@/components/ui/skeleton"


function SearchStock() {
    const { query } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true);
    const [stockList, setStockList] = useState([]);
    useEffect(() => {
        if (user) {
            fetchData();
        }
        else if (!user && !loading) {
            navigate('/login');
        }
    }, [query, user, loading, navigate]);

    const fetchData = async () => {
        try {
            var uri;
            if (query == '*') {
                uri = `/stocks/searchSymbol?symbol=a`;
            }
            else {
                uri = `/stocks/searchSymbol?symbol=${query}`;
            }
            const response = await http.get(uri);
            var data = await response.data;

            data = data.filter(stock => !stock.displaySymbol.includes('.')).map(async (stock) => {
                return await searchSymbol(stock.displaySymbol);
            });

            setStockList(await Promise.all(data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const searchSymbol = async (symbol) => {
        try {
            var querySymbol;
            var type;
            var displaySymbol;
            if (symbol.toUpperCase() == "BTC") {
                querySymbol = "BTC-USD";
                symbol = "BTC/USD";
                type = 'crypto';
                displaySymbol = "BTC";
            } else{
                querySymbol = symbol;
                type = 'stock';
            }
            console.log(symbol);            
            
            const yahooResponse = await http.get(`/testing/api/stock/${querySymbol}`);
            const displayName = yahooResponse.data.shortName;
            const regularMarketChange = yahooResponse.data.regularMarketChange.toFixed(2);
            const regularMarketChangePercent = yahooResponse.data.regularMarketChangePercent.toFixed(2);
            const currentPrice = yahooResponse.data.regularMarketPrice.toFixed(2);
            
            // Return the stock object to be added to the list            
            return {
                symbol: querySymbol,
                name: displaySymbol,
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

        return stockList.filter(stock => stock != null).map((stock, index) => (
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
            <div className='Container grid gap-5'>
                <SearchStockInput />
                <span style={{ display: 'block', marginLeft: '2rem', fontSize: '1.5rem', fontWeight: '800', marginTop: '1.5rem' }}>{query === '*' ? 'Search for a stock' : `Searching for ${query}`}</span>
                {!loading &&
                    <Table style={{ maxHeight: '60vh', width: '60vw', marginLeft: '2rem' }}>
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
                }
                {loading &&
                    <Skeleton className="w-[50%] h-[20px] rounded-full ml-10" />
                }
            </div>
        </StableSidebar>
    );
}

export default SearchStock;
