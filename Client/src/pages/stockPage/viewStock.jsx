import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import SearchStock from "@/components/stockPage/searchStock";
import StableSidebar from "@/components/StableSidebar";

function ViewStock() {
  const { symbol } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("Testing");
  };
  // var data = axios.get(`http://localhost:3000/api/stock/${symbol}`)

  return (
    <div>
      <StableSidebar>
        <div class="container w-full m-auto">
          <SearchStock />
          <ResizablePanelGroup
            direction="horizontal"
            className="w-[100vw]"
            style={{ width: "80vw", margin: "auto", marginLeft: "70px" }}
          >
            <ResizablePanel>
              <div
                className="flex m-2 flex-col items-start"
                style={{ textalign: "left", padding: "10px" }}
              >
                <span className="text-4xl font-semibold tracking-tight">
                  Nvidia
                </span>
                <span className="text-gray-500 text-sm mt-1">NASDAQ:NVDA</span>
              </div>
            </ResizablePanel>
            <ResizableHandle style={{ display: "none" }} />
            <ResizablePanel defaultSize={29} minSize={24}>
              <div className="flex h-full items-center justify-center">
                <div className="flex space-x-4">
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => navigate(`../../buyStock/${symbol}`)}
                      >
                        Buy
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                      Buying a stock means betting that its price will go up. If
                      the price rises, you profit, but if it falls, you incur a
                      loss
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => navigate(`../../sellStock/${symbol}`)}
                      >
                        Sell
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                      Buying a stock means betting that its price will go down.
                      If the price falls, you profit, but if it rises, you incur
                      a loss
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          <ResizablePanelGroup
            direction="horizontal"
            className="border"
            style={{ width: "80vw", margin: "auto", marginLeft: "70px" }}
          >
            <ResizablePanel defaultSize={73}>
              <div
                className="flex m-2 flex-col items-start"
                style={{ textalign: "left", padding: "10px" }}
              >
                <HoverCard>
                  <HoverCardTrigger>
                    <span className="text-5xl font-bold">
                      119.12{" "}
                      <span className="text-gray-600 text-base font-bold">
                        USD
                      </span>
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-xs">
                    The current price of the stock. This price is constantly
                    changing as the stock is bought and sold.
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <span className="text-green-600 text-base font-semibold mt-1">
                      + 1.79 (1.51%){" "}
                      <span className="text-gray-600 font-bold">1D</span>
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-xs">
                    The change in the stock price compared to the previous day's
                    closing price.
                  </HoverCardContent>
                </HoverCard>
              </div>
            </ResizablePanel>
            <ResizableHandle style={{ display: "none" }} />
            <ResizablePanel>
              <div
                className="flex flex-col h-full items-start justify-center text-sm"
                style={{ margin: "auto" }}
              >
                <HoverCard>
                  <HoverCardTrigger>
                    <span>High: 121.75</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-xs">
                    The highest price at which a stock has traded during the day
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <span>Low: 117.22</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-xs">
                    The lowest price at which a stock has traded during the day
                  </HoverCardContent>
                </HoverCard>
              </div>
            </ResizablePanel>
            <ResizableHandle style={{ display: "none" }} />
            <ResizablePanel>
              <div
                className="flex flex-col h-full items-start justify-center text-sm"
                style={{ margin: "auto" }}
              >
                <HoverCard>
                  <HoverCardTrigger>
                    <span>Open: 119.53</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-xs">
                    The price at which the stock first traded when the market
                    opened for the day.
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <span>Prev Close: 117.59</span>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-xs">
                    The price at which the stock last traded when the market
                    closed the previous day.
                  </HoverCardContent>
                </HoverCard>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          <ResizablePanelGroup
            direction="horizontal"
            className="border w-[100vw]"
            style={{ width: "80vw", margin: "auto", marginLeft: "70px" }}
          >
            <ResizablePanel>{/* // Put your charts here */}</ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </StableSidebar>
    </div>
  );
}

export default ViewStock;
