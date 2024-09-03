import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import BuyStockForm from '@/components/stockPage/buyStockForm'

function BuyStock() {
    const { symbol } = useParams();
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        console.log('Testing')
    }
    
    return (
        <div class="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem', textAlign: 'center'}}>
        <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem', margin:'auto'}}>
        <ResizablePanel>
        <div className="flex m-2 flex-col items-start" style={{textalign:'left', padding:'10px'}}>
            <span className="text-4xl font-semibold tracking-tight">Nvidia</span>
            <span className="text-gray-500 text-sm mt-1">NASDAQ:NVDA</span>
        </div>
        </ResizablePanel>
        <ResizableHandle style={{display:'none'}}/>
        <ResizablePanel defaultSize={25}>
            <div className="items-center"><span>NASDAQ Market Open</span></div>
        </ResizablePanel>
        </ResizablePanelGroup>
        <ResizablePanelGroup direction="horizontal" className="border w-[100vw]" style={{ width: '30vw', minWidth:'23rem', margin:'auto'}}>
        <ResizablePanel>
            <BuyStockForm />
        </ResizablePanel>
        
        </ResizablePanelGroup>
        </div>
    )

}

export default BuyStock