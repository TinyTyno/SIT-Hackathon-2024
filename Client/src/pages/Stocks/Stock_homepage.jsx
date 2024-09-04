import React, { useState, useEffect, useContext } from 'react'
import UserContext from '@/contexts/UserContext'
import StableSidebar from '@/components/StableSidebar'
import StockCard from '@/components/stockPage/StockCard'
import axios from 'axios'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import StockTable from "@/components/stockPage/StockTable";
import SearchStockInput from "@/components/stockPage/searchStockInput";

const Stock_homepage = () => {
  const { user } = useContext(UserContext);

  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    var symbolList = []
    var symbols = await axios.get(
      `http://localhost:3000/stocks/allStock`
    );
    symbols.data.map((symbol) => {
      symbolList.push(symbol.symbol)
    })
    setStocks(symbolList)

  };

  useEffect(() => {
    if (user) {
      fetchData()
    }
    else {
      console.log("no user")
    }
  }, [user])


  return (
    <div>
      <StableSidebar>
        <div className="w-[90%] m-auto">
          <SearchStockInput />
          <h1 className='text-2xl font-bold ml-10 mt-10'>
            Welcome Back, <span className='underline'>{user?.name}</span>!
          </h1>
          <h1 className='text-2xl font-bold ml-10 mt-10'>Trending Stocks</h1>
          <div className='mt-10 w-[90%] m-auto'>
            <Carousel>
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'} /></CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'} /></CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'} /></CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'} /></CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4"><StockCard name={'Nvidia'} desc={'NASA::2'} amount={'119'} pl={'1.78'} percent={'1.9'} duration={'1D'} /></CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className='mt-[3rem]'>
              <h1 className='text-2xl font-bold'>All Stocks</h1>
              <div className='mt-10'>
                <StockTable />
              </div>

            </div>
          </div>
        </div>
      </StableSidebar>
    </div>
  );
};

export default Stock_homepage;
