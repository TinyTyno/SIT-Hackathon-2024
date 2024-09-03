import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { Button } from '@/components/ui/button'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import SearchStock from '@/components/stockPage/searchStock'
import StableSidebar from '@/components/StableSidebar'
import cryptoData from '../../lib/cryptoSearch.json'
import http from '../../../http.js'
import { data } from 'autoprefixer'

function ViewStock() {
    var { symbol } = useParams();
    const navigate = useNavigate();
    const connection = useRef(null)
    var cryptoDetails = null;

    const [dataView, setDataView] = React.useState('1M');
    const [historicalData, setHistoricalData] = React.useState([]);
    const [price, setPrice] = React.useState(null);

    useEffect(() => {
        fetchData();
        marketConnection();
    }, []);

    const fetchData = async () => {
        //Setting Crypto Details
        var type;
        var querySymbol;
        if (cryptoData[symbol.toUpperCase()]) {
            cryptoDetails = cryptoData[symbol.toUpperCase()]
            type = 'crypto';
            querySymbol = cryptoDetails.alpaca;
        }
        else {
            type = 'stock';
            querySymbol = symbol;
        }

        //Getting Historical Data
        await http.get(`http://localhost:3000/stocks/stockData?type=${type}&symbol=${querySymbol}&view=${dataView}`)
            .then((response) => {
                const blah = response.data[querySymbol.toUpperCase()];
                // console.log(blah[blah.length - 1].h);
                setHistoricalData(response.data[querySymbol.toUpperCase()]);
            })
    };

    const marketConnection = () => {
        var querySymbol = symbol;
        if (cryptoDetails != null) {
            querySymbol = cryptoDetails.finnhub;
        }
        const socket = new WebSocket(`wss://ws.finnhub.io?token=${import.meta.env.VITE_FINNHUB_API_KEY}`);

        // Connection opened -> Subscribe
        socket.addEventListener('open', function (event) {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': querySymbol.toUpperCase() }))
        });

        // Listen for messages
        socket.addEventListener('message', function (event) {
            if (JSON.parse(event.data).data) {
                setPrice(JSON.parse(event.data).data[0].p.toFixed(2));
            }
        });

        connection.current = socket;

        return () => connection.close();
    }
    // var data = axios.get(`http://localhost:3000/api/stock/${symbol}`)

    return (
        <div className="container" style={{ margin: 'auto' }}>
            <StableSidebar />
            <SearchStock />
            <div className='flex' style={{ margin: 'auto', marginLeft: '70px', border: '1px solid #D9D9D9', borderRadius: '10px', marginTop: '50px' }}>
                <div className="flex m-2 flex-col items-start" style={{ textalign: 'left', padding: '10px' }}>
                    <span className="text-4xl font-semibold tracking-tight">{symbol.toUpperCase()}</span>
                    <span className="text-gray-500 text-sm mt-1">NASDAQ:NVDA</span>
                </div>
                <div className='grow'></div>
                <div className="flex items-center justify-center">
                    <div className="flex space-x-4 mx-8">
                        <HoverCard>
                            <HoverCardTrigger>
                                <Button className="px-7 py-5 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => navigate(`../../buyStock/${symbol}`)}>
                                    Buy
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                Buying a stock means betting that its price will go up.
                                If the price rises, you profit, but if it falls, you incur a loss
                            </HoverCardContent>
                        </HoverCard>
                        <HoverCard>
                            <HoverCardTrigger>
                                <Button className="px-7 py-5 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => navigate(`../../sellStock/${symbol}`)}>
                                    Sell
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                Buying a stock means betting that its price will go down.
                                If the price falls, you profit, but if it rises, you incur a loss
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            </div>

            { historicalData?.length > 0 &&
                <div className='flex' style={{ margin: 'auto', marginLeft: '70px' }}>
                    <div className="flex m-2 flex-col items-start" style={{ textalign: 'left', padding: '10px' }}>
                        <HoverCard>
                            <HoverCardTrigger><span className="text-5xl font-bold">{price || historicalData[historicalData.length - 1].c.toFixed(2)} <span className='text-gray-600 text-base font-bold'>USD</span></span></HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The current price of the stock. This price is constantly changing as the stock is bought and sold.
                            </HoverCardContent>
                        </HoverCard>
                        <HoverCard>
                            <HoverCardTrigger>
                                <span className="text-green-600 text-base font-semibold mt-1">+ 1.79 (1.51%) <span className='text-gray-600 font-bold'>1D</span></span>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The change in the stock price compared to the previous day's closing price.
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                    <div className='grow'></div>

                    <div className='flex flex-row'>
                        <div className="flex flex-col h-full items-start justify-center text-sm" style={{ margin: 'auto' }}>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span>High: {historicalData[historicalData.length - 1].h.toFixed(2)}</span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-xs">
                                    The highest price at which a stock has traded during the day
                                </HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span>Low: {historicalData[historicalData.length - 1].l.toFixed(2)}</span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-xs">
                                    The lowest price at which a stock has traded during the day
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                        <div className='w-20'></div>
                        <div className="flex flex-col h-full items-start justify-center text-sm" style={{ margin: 'auto' }}>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span>Open: {historicalData[historicalData.length - 1].o.toFixed(2)}</span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-xs">
                                    The price at which the stock first traded when the market opened for the day.
                                </HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <span>Prev Close: {historicalData[historicalData.length - 1].c.toFixed(2)}</span>
                                </HoverCardTrigger>
                                <HoverCardContent className="text-xs">
                                    The price at which the stock last traded when the market closed the previous day.
                                </HoverCardContent>
                            </HoverCard>
                        </div>
                    </div>
                </div>            
            }
        </div>
    );
}

export default ViewStock





