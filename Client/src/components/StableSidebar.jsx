import React, { useState } from "react";
import { MdDashboard, MdOutlineClose } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import clsx from 'clsx'; 

const StableSidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {!isOpen ? (
        <div className="z-50">
          <div className="h-screen fixed top-0 left-0 w-[15rem] bg-[#233F59] py-[1em] px-5">
            <div className="justify-center flex flex-col gap-7 ">
              <div
                className="ml-auto p-2 hover:bg-[#516e9531] rounded-sm cursor-pointer"
                onClick={toggleSidebar}
              >
                <FaAngleLeft className="text-white" />
              </div>
              <div className="self-center">
                <img src="/Logo.svg" alt="logo" className="h-5 w-auto" />
              </div>
              <ul className="flex flex-col gap-3 text-white px-2">
              
                  <Link to="/dashboard">
                  <li className="flex flex-row gap-4 w-full py-2 px-3 rounded-sm hover:bg-[#516e9578] cursor-pointer">
                  <div className="self-center">
                    <MdDashboard className="text-white" />
                  </div>
                  <div className="self-center justify-self-center">
                    Dashboard
                  </div>
                </li>
                </Link>
                <li className="flex flex-row gap-4 w-full py-2 px-3 rounded-sm hover:bg-[#516e9578] cursor-pointer">
                  <div className="self-center">
                    <ImProfile className="text-white" />
                  </div>
                  <div className="self-center">Portfolio</div>
                </li>
              </ul>
            </div>
          </div>
          <main className= 'pl-[16rem] box-border'>{children}</main>
        </div>
      ) : (
        <div className="z-50">
          <div className="h-screen fixed top-0 left-0 w-[5rem] bg-[#233F59] py-[1em] px-2">
            <div className="justify-center flex flex-col gap-7 ">
              <div
                className="ml-auto p-2 hover:bg-[#516e9531] rounded-sm cursor-pointer"
                onClick={toggleSidebar}
              >
                <FaAngleRight className="text-white" />
              </div>
              <div className="self-center">
                <img src="/smallLogo.svg" alt="logo" className="h-5 w-auto" />
              </div>
              <ul className="flex flex-col gap-3 text-white px-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <li className="flex flex-row justify-center gap-4 w-full py-3 rounded-sm hover:bg-[#516e9578] cursor-pointer">
                       <Link to="/dashboard">
                       <div className="self-center w-fit">
                          <MdDashboard className="text-white" />
                        </div></Link>
                      </li>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Dashboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <li className="flex flex-row justify-center gap-4 w-full py-2 rounded-sm hover:bg-[#516e9578] cursor-pointer">
                       <Link to="/dashboard">
                       <div className="self-center w-fit">
                          <ImProfile className="text-white" />
                        </div></Link>
                      </li>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Portfolio</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              </ul>
            </div>
          </div>
          <main className="pl-[6rem]">{children}</main>
        </div>
      )}
    </>
  );
};

export default StableSidebar;
