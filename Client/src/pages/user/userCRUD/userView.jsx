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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StockTable from "@/components/stockPage/StockTable";
import { Input } from "@/components/ui/input";

function DeleteToolbar({ selected, handleOpenConfirmation, handleOpen }) {
  const handleDelete = () => {
    console.log("data", selected);
    if (selected !== null) {
      handleOpenConfirmation();
    } else {
      handleOpen();
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleDelete}
      >
        Delete
        <span className="ml-2">🗑️</span>
      </button>
    </div>
  );
}

function UserView() {
  const { user, setUser } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [isOpenForm, setOpenForm] = useState(false);
    const [isOpenEditForm, setOpenEditForm] = useState(false);
    const [username, setUserName] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [cash, setCash] = useState(0);
  const holdingData = [
    {
      symbol: "AAPL",
      name: "Apple Inc",
      position: 25,
      market: 864343.8,
      last: 137.27,
      cost: 137.27,
      unrealisedPL: 100,
    },
    {
      symbol: "BTC",
      name: "Bitcoin Inc",
      position: 25,
      market: 864343.8,
      last: 137.27,
      cost: 137.27,
      unrealisedPL: 100,
    },
  ];

  const fetchData = async (id) => {
    await http
      .get(`/user/${id}`)
      .then((res) => {
        setUserInfo(res.data), console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user) {
      setUser(user);
      fetchData(user.id);
    }
  }, [user]);

  const navigate = useNavigate();

  const handleReset = async () => {
    await http
      .put(`/user/${user.id}`, {
        ...userInfo,
        cashBalance: 0,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    handleClose();
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
    console.log(e)
    setCash(e.target.value);
  };
  const submitTopup = async () => {
    console.log("cash", cash);
    await http.put(`/user/${user.id}`, {
        ...userInfo,
        cashBalance: cash,
        }).then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
    setOpenForm(false);
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
    await http.put(`/user/${user.id}`, {
        ...userInfo,
        name: username,
        }).then((res) => {
            console.log(res.data);
            })
            .catch((err) => {
            console.log(err);
            });
    setOpenEditForm(false);
    };
  const deleteUser = () => {
    if (selected.length > 0) {
      selected.forEach((element) => {
        http
          .delete(`/user/${element}`)
          .then((res) => {
            console.log(res.data);
            setOpenConfirm(false);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
    fetchData();
  };

  return (
    <>
      <StableSidebar>
        <div className="flex">
          <main className="flex-grow ">
            <div className="relative p-10">
              <div className=" absolute top-0 left-0  bg-[url('/bgProfile.svg')] bg-cover bg-center px-10 py-5 w-full">
                <div className="flex justify-between mb-2 mt-1">
                  <h1 className="text-3xl font-semibold">{userInfo.name}</h1>
                  <Dialog open={isOpenEditForm} onOpenChange={setOpenEditForm} className="p-5">
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
                          <Button onClick={confirmEditing} className="bg-[#2C74E1] hover:bg-[#2460b9]">
                             Change
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                  
                </div>
                <p className="text-lg font-semibold">{userInfo.email}</p>
              </div>
              <div className="flex flex-row gap-10 pt-[8em]">
                <div className="">
                  {/* Portfolio box */}
                  <h3 className="text-2xl font-semibold mb-5">Portfolio</h3>
                  <Card className="bg-gradient-to-tr to-[#103593] from-[#146AB9] grid gap-2">
                    <CardHeader className="pt-6 pb-3">
                      <CardTitle className="text-white font-light text-sm">
                        Your assets USDS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3 pt-2">
                      <p className="text-6xl text-white font-semibold">17112</p>
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-row justify-between gap-14 w-full">
                        <div>
                          <h5 className="text-white">Unrealized P&L</h5>
                          <p className="text-white font-bold">$15000</p>
                        </div>
                        <div className="mr-20">
                          <h5 className="text-white">Daily P&L</h5>
                          <p className="text-green-600 font-bold">+9.5%</p>
                          <p className="text-green-600 font-bold">+9.5%</p>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
                <div className="">
                  {/* Cash balance box */}
                  <h3 className="text-2xl font-semibold mb-5">
                    Est Cash Balance
                  </h3>
                  <Card className="bg-white grid gap-2 min-w-[25em] max-h-full">
                    <CardHeader className="pt-6 pb-3">
                      <CardTitle className="flex flex-row justify-between items-center">
                        <h5 className="text-black font-light text-sm self-center">
                          Your assets USD
                        </h5>
                        <Dialog open={isOpen} onOpenChange={setOpen} className="p-[3em]">
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
                                This action cannot be undone. This will reset
                                your cash balance to 0.
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
                        $ {userInfo.cashBalance}
                      </p>
                    </CardContent>
                    <CardFooter className="my-4">
                      <Dialog open={isOpenForm} onOpenChange={setOpenForm} className="p-5">
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
                          <Button onClick={submitTopup} className="bg-[#2C74E1] hover:bg-[#2460b9]">
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
                    <div className="flex flex-row justify-between w-full">
                      <h5 className="text-sm text-gray-500">
                        Country Market Cap (USD){" "}
                        <span className="text-black font-semibold">82,220</span>
                      </h5>
                      <div className="text-green-600">14,283</div>
                    </div>
                    <div>
                      {/* <StockTable type="profile" data={holdingData}/> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Confirmation Modal
        {openConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-300 shadow-lg p-4 w-96">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete the following users?</p>
              <ul className="list-disc pl-5 mt-2">
                {selectedUser?.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={deleteUser}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleCloseConfirmation}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {/* {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-300 shadow-lg p-4 w-96">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              {/* Add form to edit user here */}
        {/* <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleClose}
                >
                  Save
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>  */}
        {/* )} */}
      </StableSidebar>
    </>
  );
}

export default UserView;
