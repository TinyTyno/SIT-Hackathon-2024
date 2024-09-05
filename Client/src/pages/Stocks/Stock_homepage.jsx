import React, { useState, useEffect, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import StableSidebar from "@/components/StableSidebar";
import StockCard from "@/components/stockPage/StockCard";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import StockTable from "@/components/stockPage/StockTable";
import SearchStockInput from "@/components/stockPage/searchStockInput";
import { useNavigate } from "react-router-dom";
const Stock_homepage = () => {
  const { user } = useContext(UserContext);
  const [scoreboard, setScoreboard] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchData = async () => {
    var symbolList = [];
    var symbols = await axios.get(`http://localhost:3000/stocks/allStock`);
    symbols.data.map((symbol) => {
      symbolList.push(symbol.symbol);
    });
    setStocks(symbolList);
  };
  const fetchUsers = async () => {
    var users = await axios.get(`http://localhost:3000/user`);
    if (users?.data) {
      let temp = [];
      users.data.map((user) => {
        const profit = user.cashBalance - user.startingBalance;
        if (profit > 0) {
          temp.push({
            username: user.name,
            email: user.email,
            profit: profit,
          });
        }
      });
      if (temp.length > 0) {
        temp.sort((a, b) => b.profit - a.profit).slice(0, 3);
        setScoreboard(temp);
      }
    }
  };

  useEffect(() => {
    console.log("user", user);
    if (user) {
      fetchData();
      fetchUsers();
      setLoading(false);
    } else if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <div>
      <StableSidebar>
        <div className="">
          <SearchStockInput />
          <h1
            className="text-2xl font-bold ml-10 mt-10 text-[#103593] "
          >
            Welcome Back, <span className="underline">{user?.name}</span>!
          </h1>
          {scoreboard.length > 0 && (
            <div className=" ml-10 mt-10 mb-5">
              <h1 className="text-2xl font-bold mb-3">Ranking</h1>
              <div className="w-[30%]">
                <Table className="">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Username</TableHead>
                      <TableHead className="w-[80px]">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scoreboard.map((u, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="text-sm font-semibold">
                            {u.username}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </TableCell>
                        <TableCell className="text-green-600 font-bold">
                          ${u.profit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
          <h1 className="text-2xl font-bold ml-10 mt-12">Trending Stocks</h1>
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
              <div className="mt-10">
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
