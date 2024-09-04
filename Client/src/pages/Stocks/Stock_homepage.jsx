import React, { useState, useEffect, useMemo } from "react";
import StableSidebar from "@/components/StableSidebar";
import StockCard from "@/components/stockPage/StockCard";
import axios from "axios";
import http from "../../../http";
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
  const [stocks, setStocks] = useState([]);

  const invoiceData = [
    {
      id: 1,
      invoiceNumber: "INV001",
      status: "Paid",
      method: "Credit Card",
      amount: "$250.00",
    },
    // Add more invoice objects as needed
  ];
  const fetchData = async () => {
    var symbolList = []
    var symbols = await axios.get(
      `http://localhost:3000/stocks/allStock`
    );
    // const yahooResponse = await axios.get(`http://localhost:3000/testing/api/trendingStocks`);
    // console.log('yahooResponse.data', yahooResponse.data);
    // var data = await axios.get(
    //   "http://localhost:3000/stocks/stockData?symbol=AAPL&type=stock&view=1D"
    // );
    symbols.data.map((symbol) => {
      symbolList.push(symbol.symbol)
    })
    setStocks(symbolList)
    // console.log("data", data);
    // var stockArray = data.data["AAPL"];
    // console.log(stockArray);
    // var latest = stockArray[stockArray.length - 1];
    // console.log(latest);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <StableSidebar>
        <div className="w-[90%] m-auto">
          <SearchStockInput />
          <h1 className="text-2xl font-bold ml-10 mt-10">Trending Stocks</h1>
          <div className="mt-10 w-[90%] m-auto">
            <Carousel>
              <CarouselContent>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                  <StockCard
                    name={"Nvidia"}
                    desc={"NASA::2"}
                    amount={"119"}
                    pl={"1.78"}
                    percent={"1.9"}
                    duration={"1D"}
                  />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                  <StockCard
                    name={"Nvidia"}
                    desc={"NASA::2"}
                    amount={"119"}
                    pl={"1.78"}
                    percent={"1.9"}
                    duration={"1D"}
                  />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                  <StockCard
                    name={"Nvidia"}
                    desc={"NASA::2"}
                    amount={"119"}
                    pl={"1.78"}
                    percent={"1.9"}
                    duration={"1D"}
                  />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                  <StockCard
                    name={"Nvidia"}
                    desc={"NASA::2"}
                    amount={"119"}
                    pl={"1.78"}
                    percent={"1.9"}
                    duration={"1D"}
                  />
                </CarouselItem>
                <CarouselItem className="md:basis-1/2 lg:basis-1/4">
                  <StockCard
                    name={"Nvidia"}
                    desc={"NASA::2"}
                    amount={"119"}
                    pl={"1.78"}
                    percent={"1.9"}
                    duration={"1D"}
                  />
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="mt-[3rem]">
              <h1 className="text-2xl font-bold">All Stocks</h1>
              <div className="py-10">
                <StockTable data={stocks} />
              </div>
            </div>
          </div>
        </div>
      </StableSidebar>
    </div>
  );
};

export default Stock_homepage;
