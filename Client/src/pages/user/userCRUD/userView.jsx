import { React, useState, useCallback, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../../../contexts/UserContext";
import http from "../../../http.js";
import StableSidebar from "@/components/StableSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function UserView() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [cashBalance, setCashBalance] = useState(0);
  const [accountID, setAccountID] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isOpenForm, setOpenForm] = useState(false);
  const [isOpenEditForm, setOpenEditForm] = useState(false);
  const [username, setUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [cash, setCash] = useState(0);
  const [holdingData, setHoldingData] = useState([]); // User holdings
  const [assetValue, setAssetValue] = useState(0); // Total asset value

  // const holdingData = [
  //   {
  //     symbol: "AAPL",
  //     name: "Apple Inc",
  //     position: 25,
  //     market: 864343.8,
  //     last: 137.27,
  //     cost: 137.27,
  //     unrealisedPL: 100,
  //   },
  //   {
  //     symbol: "BTC",
  //     name: "Bitcoin Inc",
  //     position: 25,
  //     market: 864343.8,
  //     last: 137.27,
  //     cost: 137.27,
  //     unrealisedPL: 100,
  //   },
  // ];

  const fetchData = async (id) => {
    // Gets the current user's information
    const user = await http.get(`/user/${id}`);
    if (user) {
      setUserInfo(user.data);
      setCashBalance(user.data.cashBalance);
      setAccountID(user.data.id);
      console.log("user", user);

      try {
        var holdings = [];
        const response = await http.get(
          `http://localhost:3000/transactions/getUserStocks?id=${id}`
        );
        console.log("response", response);
        const data = response.data;
        console.log("holdings list is" + data);
        for (let i = 0; i < data.length; i++) {
          // Get name of the company
          var symbolSearch = await http.get(
            `http://localhost:3000/stocks/searchsymbol?symbol=${data[i].stock}`
          );
          var name = symbolSearch.data.result[0].description;
          console.log(symbolSearch.data.result[0].description);
          // Get current price of the stock
          var priceSearch = await http.get(
            `http://localhost:3000/testing/api/stock/${data[i].stock}`
          );
          var currentPrice = priceSearch.data.regularMarketPrice;
          var holding = {
            symbol: data[i].stock,
            name: name,
            marketValue: parseFloat(currentPrice) * parseInt(data[i].quantity),
            quantity: data[i].quantity,
            priceBought: data[i].priceBought,
            currentPrice: currentPrice,
            PL: (currentPrice - data[i].priceBought) * data[i].quantity,
          };
          holdings.push(holding);
        }
        setHoldingData(holdings);
        let asst = CalculateAsset(user.data.cashBalance, holdings)
        setAssetValue(asst)
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }
    // Gets the current user's holdings and adds them to a dictionary

    // passes through a loop to access each of the holdings, and also to calculate other variables
  };

  // FOR REFERENCE
  {
    /* <TableHead>Symbol</TableHead>
<TableHead>Name</TableHead>
<TableHead>Market Value</TableHead>
<TableHead>Quantity</TableHead>
<TableHead>Current Price</TableHead>
<TableHead>Price Bought</TableHead>
<TableHead>P/L</TableHead> */
  }

    useEffect(() => {
      if (user) {
        setUser(user);
        fetchData(user.id);
        CalculateAsset();
      }
    }, [user]);

  const handleReset = async () => {
    await http
      .put(`/user/${user.id}`, {
        ...userInfo,
        cashBalance: 10000.0,
        startingBalance: 10000.0,
      })
      .then((res) => {
        setCashBalance(10000.0);
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
    console.log("holding",holdingData)
    let asst = CalculateAsset(10000.0, holdingData)
    setAssetValue(asst)
  };
  const submitTopup = async () => {
    let inputcash = parseFloat(cash).toFixed(2);
    await http
      .put(`/user/${user.id}`, {
        ...userInfo,
        cashBalance: inputcash,
        startingBalance: inputcash,
      })
      .then((res) => {
        setCashBalance(inputcash)
      })
      .catch((err) => {
        console.log(err);
      });
    setOpenForm(false);
    console.log("holdingtopup",holdingData,inputcash)
    let asst = CalculateAsset(inputcash, holdingData)
    setAssetValue(asst)
  };
  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTopup = (e) => {
    console.log(e);
    setCash(e.target.value);
  };

 

  const handleOpenEditForm = () => {
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };
  const handleUserName = (e) => {
    setUserName(e.target.value);
  };
  const confirmEditing = async () => {
    await http
      .put(`/user/${user.id}`, {
        ...userInfo,
        name: username,
      })
    setOpenEditForm(false);
  };

    // Output the User holdings tables
    function UserHoldingsOutput() {
        CalculateAsset();
        if (!Array.isArray(holdingData) || holdingData.length === 0) {
        return (
            <TableRow>
            <TableCell colSpan="4">No data available or failed to fetch.</TableCell>
            </TableRow>
        )};
        return holdingData.map((holding) => (
          <TableRow>
            <TableCell>{holding.symbol}</TableCell>
            <TableCell>{holding.name}</TableCell>
            <TableCell>{(holding.marketValue).toFixed(2)} USD</TableCell>
            <TableCell>{holding.quantity}</TableCell>
            <TableCell>{(holding.currentPrice).toFixed(2)} USD</TableCell>
            <TableCell>{(holding.priceBought)} USD</TableCell>
            <TableCell className={holding.PL < 0 ? 'text-red-500' : 'text-green-500'}>{(holding.PL).toFixed(2)} USD ({(holding.PL / (holding.priceBought * holding.quantity) * 100).toFixed(2)}%)</TableCell>
          </TableRow>
        ))
    }

    // Calculate the total asset value including cash balance and stocks, and also calculates the p/l and percentage

  // Calculate the total asset value including cash balance and stocks, and also calculates the p/l and percentage
  const CalculateAsset = (userBalance, holdData) => {
        console.log("calculate asset", userBalance,holdData);
        let total = 0;
      console.log('holdingdata is ' + holdData, 'type is ' + typeof(holdData))
      if (!holdData) {
        console.log('cash balance is ' + userBalance)
        total += parseFloat(userBalance);
        return total
      }
      for (let i = 0; i < holdData.length; i++) {
        if (holdData[i].marketValue < 0) {
          total -= parseFloat(holdData[i].marketValue);
        }
        else {
          total += parseFloat(holdData[i].marketValue);
        }
      }
      console.log(total)
      total += parseFloat(userBalance);
      return total
    }

    async function CalculateAsset2() {
      let total = 0;
      for (let i = 0; i < holdingData.length; i++) {
        if (holdingData[i].marketValue < 0) {
          total -= holdingData[i].marketValue;
        }
        else {
          total += holdingData[i].marketValue;
        }
      }
      console.log(total)
      total += parseFloat(userInfo.cashBalance);
      return total
    }

  return (
    <>
      <StableSidebar>
        <div className="flex">
          <main className="flex-grow ">
            <div className="relative p-10">
              <div className=" absolute top-0 left-0  bg-[url('/bgProfile.svg')] bg-cover bg-center px-10 py-5 w-full">
                <div className="flex justify-between mb-2 mt-1">
                  <h1 className="text-3xl font-semibold">{userInfo.name}</h1>
                  <Dialog
                    open={isOpenEditForm}
                    onOpenChange={setOpenEditForm}
                    className="p-5"
                  >
                    <DialogTrigger onClick={handleOpenEditForm}>
                      <Button className="text-lg font-semibold bg-transparent hover:bg-transparent text-red-500 hover:text-red-600 cursor-pointer">
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="pt-12 pb-8 w-[20em]">
                      <form>
                        <Input
                          type="string"
                          name="username"
                          value={username}
                          onChange={handleUserName}
                          placeholder="Change Username"
                          required
                        />
                      </form>
                      <DialogFooter>
                        <Button
                          onClick={confirmEditing}
                          className="bg-[#2C74E1] hover:bg-[#2460b9]"
                        >
                          Change
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-lg font-semibold">{userInfo.email}</p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-[50vh]">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-row gap-10 pt-[8em]">
                    <div className="">
                      {/* Portfolio box */}
                      <h3 className="text-2xl font-semibold mb-5">
                        <HoverCard>
                          <HoverCardTrigger>
                            Portfolio
                          </HoverCardTrigger>
                          <HoverCardContent className='text-sm'>
                            Your portfolio is a collection of all your investments
                            including stocks and cash balance.
                          </HoverCardContent>
                        </HoverCard>
                      </h3>
                      <Card className="bg-gradient-to-tr to-[#103593] from-[#146AB9] grid gap-2">
                        <CardHeader className="pt-6 pb-3">
                          <CardTitle className="text-white font-light text-sm">
                            Your assets USDS
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3 pt-2">
                          <p className="text-6xl text-white font-semibold">
                            {assetValue.toFixed(2)}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <div className="flex flex-row justify-between gap-14 w-full">
                            <div>
                              <h5 className="text-white">
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Unrealized P&L
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    Potential profit or loss on your investments that
                                    have not yet been sold or closed.
                                  </HoverCardContent>
                                </HoverCard>
                              </h5>
                              <p className="text-white font-bold">
                                ${(assetValue - 10000).toFixed(3)}
                              </p>
                            </div>
                            <div className="mr-20">
                              <h5 className="text-white">
                                  <HoverCard>
                                    <HoverCardTrigger>
                                      P&L Percentage
                                    </HoverCardTrigger>
                                    <HoverCardContent className='text-sm'>
                                      The percentage of profit or loss on your investments
                                      based on your starting balance
                                      that have not yet been sold or closed.
                                    </HoverCardContent>
                                  </HoverCard>
                              </h5>
                              <p
                                className={
                                  assetValue - 10000 < 0
                                    ? "text-red-500 font-bold"
                                    : "text-green-500 font-bold"
                                }
                              >
                                +
                                {(((assetValue - 10000) / 10000) * 100).toFixed(
                                  3
                                )}
                                %
                              </p>
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                    <div className="">
                      {/* Cash balance box */}
                      <h3 className="text-2xl font-semibold mb-5">
                        <HoverCard>
                          <HoverCardTrigger>
                            Cash Balance
                          </HoverCardTrigger>
                          <HoverCardContent className='text-sm'>
                            Your cash balance is the amount of money you have
                            available to invest in stocks.
                          </HoverCardContent>
                        </HoverCard>
                      </h3>
                      <Card className="bg-white grid gap-2 min-w-[25em] max-h-full">
                        <CardHeader className="pt-6 pb-3">
                          <CardTitle className="flex flex-row justify-between items-center">
                            <h5 className="text-black font-light text-sm self-center">
                              Your assets USD
                            </h5>
                            <Dialog
                              open={isOpen}
                              onOpenChange={setOpen}
                              className="p-[3em]"
                            >
                              <DialogTrigger
                                onClick={handleOpen}
                                className="  text-red-500 hover:text-red-600 self-center text-sm cursor-pointer"
                              >
                                Reset
                              </DialogTrigger>
                              <DialogContent className="">
                                <DialogHeader className={"grid gap-2"}>
                                  <DialogTitle>
                                    Are you sure you want to reset?
                                  </DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will
                                    reset your cash balance to 10000 and all
                                    your current progress will be cleared.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    onClick={handleClose}
                                    variant="secondary"
                                  >
                                    Close
                                  </Button>
                                  <Button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={handleReset}
                                  >
                                    Reset
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3 pt-2">
                          <p className="text-6xl text-black font-semibold">
                            $ {cashBalance}
                          </p>
                        </CardContent>
                        <CardFooter className="my-4">
                          <Dialog
                            open={isOpenForm}
                            onOpenChange={setOpenForm}
                            className="p-5"
                          >
                            <DialogTrigger onClick={handleOpenForm}>
                              <Button className="bg-[#2C74E1] hover:bg-[#2460b9]">
                                Top Up
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="pt-12 pb-8 w-[20em]">
                              <form>
                                <Input
                                  type="number"
                                  name="quantity"
                                  value={cash}
                                  onChange={handleTopup}
                                  placeholder="Cash Amount"
                                  min="1"
                                  required
                                />
                              </form>
                              <DialogFooter>
                                <Button
                                  onClick={submitTopup}
                                  className="bg-[#2C74E1] hover:bg-[#2460b9]"
                                >
                                  Top Up
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                  <div>
                    <div className="py-[3em]">
                      <h3 className="text-2xl font-semibold mb-5">Holdings</h3>
                      <div>
                        <Table>
                          <TableCaption>
                            <HoverCard>
                              <HoverCardTrigger>
                                Holdings
                              </HoverCardTrigger>
                              <HoverCardContent className='text-sm'>
                                Holdings are the stocks that you have
                                purchased and are currently holding.
                              </HoverCardContent>
                            </HoverCard>
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Stock
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The company you are currently investing in represented by the
                                    stock symbol.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                              <TableHead>Name
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Name
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The name of the company you are currently investing in.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                              <TableHead>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Market Value
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The total value of the stock you are currently holding.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                              <TableHead>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Quantity
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The number of stocks you have purchased.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                              <TableHead>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Current Price
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The current price of the stock you are currently holding.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                              <TableHead>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    Price Bought
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The price at which you purchased the stock.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                              <TableHead>
                                <HoverCard>
                                  <HoverCardTrigger>
                                    P/L
                                  </HoverCardTrigger>
                                  <HoverCardContent className='text-sm'>
                                    The profit or loss you have made on the stock.
                                  </HoverCardContent>
                                </HoverCard>
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <UserHoldingsOutput />
                          </TableBody>
                        </Table>
                        <div className="flex flex-row justify-between w-full">
                          <h5 className="text-sm text-gray-500">
                            Copyright VirtuTrade{" "}
                            <span className="text-black font-semibold">
                              2024
                            </span>
                          </h5>
                          <div className="text-green-600"></div>
                        </div>
                        <div>
                          {/* <StockTable type="profile" data={holdingData}/> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </StableSidebar>
    </>
  );
}

export default UserView;
