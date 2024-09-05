import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import BuyStockForm from '@/components/stockPage/buyStockForm'
import StableSidebar from '@/components/StableSidebar';
import UserContext from '@/contexts/UserContext';
import cryptoData from '../../lib/cryptoSearch.json'
import http from '@/http'


function BuyStock() {
    const upper = useParams().symbol.toUpperCase();
    const symbol = upper;
    const navigate = useNavigate();
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(true);
    const [currentPrice, setCurrentPrice] = useState(null);
    const [highPrice, setHighPrice] = useState(null);
    const [lowPrice, setLowPrice] = useState(null);
    const [numberOfTrades, setNumberOfTrades] = useState(null);
    const [openPrice, setOpenPrice] = useState(null);
    const [timestamp, setTimestamp] = useState(null);
    const [volume, setVolume] = useState(null);
    const [volumeWeightedAveragePrice, setVolumeWeightedAveragePrice] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [regularMarketChange, setRegularMarketChange] = useState(null);
    const [regularMarketChangePercent, setRegularMarketChangePercent] = useState(null);
    const [regularMarketPreviousClose, setRegularMarketPreviousClose] = useState(null);

    useEffect(() => {
        if (user) {
            fetchData();
            setLoading(false);
        }
        else if (!user && !loading) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const fetchData = async () => {
        try {
            // Check if the symbol is a stock or a crypto
            var type;
            var querySymbol;
            if (cryptoData[symbol]) {
                cryptoDetails = cryptoData[symbol]
                type = 'crypto';
                querySymbol = cryptoDetails.alpaca;
            }
            else {
                type = 'stock';
                querySymbol = symbol;
            }

            var data = await http.get(`http://localhost:3000/stocks/stockData?symbol=${symbol}&type=${type}&view=5D`);
            var stockArray = (data.data[symbol])
            console.log(stockArray[stockArray.length - 1])

            const latest = stockArray[stockArray.length - 1]
            const currentPrice = latest.c
            const highPrice = latest.h
            const lowPrice = latest.l
            const numberOfTrades = latest.n
            const openPrice = latest.o
            const timestamp = latest.t
            const volume = latest.v
            const volumeWeightedAveragePrice = latest.vw
            setCurrentPrice(currentPrice.toFixed(2));
            setHighPrice(highPrice.toFixed(2));
            setLowPrice(lowPrice.toFixed(2));
            setNumberOfTrades(numberOfTrades);
            setOpenPrice(openPrice.toFixed(2));
            setTimestamp(timestamp);
            setVolume(volume);
            setVolumeWeightedAveragePrice(volumeWeightedAveragePrice.toFixed(2));

            var yahoo = await http.get(`http://localhost:3000/testing/api/stock/${symbol}`);
            console.log('yahoo', yahoo)
            const displayName = yahoo.data.shortName;
            const regularMarketChange = yahoo.data.regularMarketChange;
            const regularMarketChangePercent = yahoo.data.regularMarketChangePercent;
            const regularMarketPreviousClose = yahoo.data.regularMarketPreviousClose;

            setDisplayName(displayName);
            setRegularMarketChange(regularMarketChange.toFixed(2));
            setRegularMarketChangePercent(regularMarketChangePercent.toFixed(2));
            setRegularMarketPreviousClose(regularMarketPreviousClose.toFixed(2));
        }
        catch (error) {
            console.log(error)
        }
    };

    return (
        <StableSidebar>
            <div class="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem', margin:'auto'}}>
                <ResizablePanel>
                <div className="flex m-2 flex-col items-start" style={{textalign:'left', padding:'10px'}}>
                    <span className="text-4xl font-semibold tracking-tight" style={{textAlign:'left'}}>{displayName}</span>
                    <span className="text-gray-500 text-sm mt-1">NASDAQ:{symbol}</span>
                </div>
                </ResizablePanel>
                <ResizableHandle style={{display:'none'}}/>
                </ResizablePanelGroup>
                <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem', margin:'auto'}}>
                <ResizablePanel>
                        <div className="ml-4 flex flex-col h-full items-start justify-center text-sm" style={{padding:'10px'}}>
                            <span>High: {highPrice}</span>
                            <span>Low: {lowPrice}</span>
                        </div>
                </ResizablePanel>
                <ResizableHandle style={{display:'none'}}/>
                <ResizablePanel>
                        <div className="flex flex-col h-full items-start justify-center text-sm">
                            <span>Open: {openPrice}</span>
                            <span>Prev Close: {regularMarketPreviousClose}</span>
                        </div>
                </ResizablePanel>
                </ResizablePanelGroup>
                <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem', margin:'auto'}}>
                <ResizablePanel>
                    <BuyStockForm currentPrice={currentPrice} />
                </ResizablePanel>
                
                </ResizablePanelGroup>
                {/* <div className='flex justify-between' style={{ margin: 'auto', marginLeft: '2rem', marginRight: '30px', marginTop: '50px' }}>
                    <div className="flex m-2 flex-col items-start" style={{ textalign: 'left', padding: '10px' }}>
                        <span className="text-4xl font-semibold tracking-tight">{displayName}</span>
                        <span className="text-gray-500 text-sm mt-1">{symbol}</span>
                    </div>

                    <div className='flex flex-row'>
                        <div className="flex flex-col h-full items-start justify-center text-sm" style={{ margin: 'auto' }}>
                            <span>High: 100.1</span>
                            <span>Low: 100.1</span>
                        </div>
                        <div className='w-20'></div>
                        <div className="flex flex-col h-full items-start justify-center text-sm" style={{ margin: 'auto' }}>
                            <span>Open: 100.1</span>
                            <span>Prev Close: 100.1</span>
                        </div>
                    </div>
                </div>
                <div className="border w-[100vw]" style={{ width: '30vw', minWidth: '23rem', margin: 'auto' }}>
                    <BuyStockForm currentPrice={currentPrice} />
                </div> */}
            </div>
        </StableSidebar>
    )

}

export default BuyStock