import React,{useState,useEffect} from 'react'
import StableSidebar from '@/components/StableSidebar'
import SearchStock from '@/components/stockPage/searchStock'
import StockCard from '@/components/stockPage/StockCard'
import axios from 'axios'
import http from '../../../http'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
import StockTable from '@/components/stockPage/StockTable';
  
const Stock_homepage = () => {
  const [stocks, setStocks] = useState([])
  const fetchData = async () => {
    var data = await axios.get("http://localhost:3000/stocks/stockData?symbol=AAPL&type=stock&view=1D");
    console.log(data)
    var stockArray = (data.data['AAPL'])
    console.log(stockArray)
    var latest = stockArray[stockArray.length - 1]
    console.log(latest)
};


  useEffect(() => {
fetchData()
  }, [])
  return (
    <div>
      <StableSidebar>
        <div className="w-[90%] m-auto">
           <SearchStock/> 
           <h1 className='text-2xl font-bold ml-10 mt-10'>Trending Stocks</h1>
           <div className='mt-10 w-[90%] m-auto'>
           <Carousel>
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'}/></CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'}/></CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'}/></CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'}/></CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'}/></CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className='mt-[3rem]'>
          <h1 className='text-2xl font-bold'>All Stocks</h1>
          <div className='mt-10'>
          <StockTable/>
          </div>
           
          </div>
           </div>
        </div>
      </StableSidebar>
    </div>
  )
}

export default Stock_homepage
