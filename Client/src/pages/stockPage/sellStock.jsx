import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import SellStockForm from '@/components/stockPage/SellStockForm'

function SellStock() {
    const upper = useParams().symbol.toUpperCase();
    const symbol = upper;
    const navigate = useNavigate();

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
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            var data = await axios.get(`http://localhost:3000/stocks/stockData?symbol=${symbol}&type=stock&view=5D`);
            var stockArray = (data.data[symbol])
            console.log(stockArray[stockArray.length - 1])

            const latest = stockArray[stockArray.length - 1]
            console.log('latest is ' +latest.c)
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

            var yahoo = await axios.get(`http://localhost:3000/testing/api/stock/${symbol}`);
            const displayName = yahoo.data.displayName;
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
        <div class="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', textAlign: 'center'}}>
        <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem' , margin:'auto'}}>
        <ResizablePanel>
        <div className="flex m-2 flex-col items-start" style={{textalign:'left', padding:'10px'}}>
            <span className="text-4xl font-semibold tracking-tight">{displayName}</span>
            <span className="text-gray-500 text-sm mt-1">NASDAQ:{symbol}</span>
        </div>
        </ResizablePanel>
        <ResizableHandle style={{display:'none'}}/>
        <ResizablePanel defaultSize={25}>
            <div className="items-center"><span>NASDAQ Market Open</span></div>
        </ResizablePanel>
        </ResizablePanelGroup>
        <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem', margin:'auto'}}>
        <ResizablePanel>
            <SellStockForm currentPrice={currentPrice} />
        </ResizablePanel>
        
        </ResizablePanelGroup>
        </div>
    )

}

export default SellStock