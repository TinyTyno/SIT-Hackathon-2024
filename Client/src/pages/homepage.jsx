import React from "react";
import Navbar from "@/components/Navbar";
import { AiOutlineCopyright } from "react-icons/ai";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FaRobot } from "react-icons/fa";


import { Button } from "@/components/ui/button";
import StockCard from "@/components/stockPage/StockCard";
import { Link } from "react-router-dom";
const Homepage = () => {
  return (
    <main id="top" className="relative min-h-screen w-full bg-white scroll-smooth">
      <Navbar />
      <section className=" grid gap-5 lg:gap-[8em] lg:grid-cols-[40%,auto] ">
        <div className=" py-[5em] lg:py-0 lg:self-center w-[90%] lg:w-[75%] mr-auto lg:mr-0 ml-auto">
          <div className="grid gap-5 text-black">
            <h1 className="text-[2.7rem] leading-[3.25rem] font-bold">
              Learn Financial Skills Through Realistic Stock Trading Simulations
            </h1>
            <p>
              Our platform enhances teenage financial literacy with interactive
              trading simulations and stock exchange experiences, providing
              hands-on learning to develop essential financial skills.
            </p>
            <Link to="/user/userCreate">
              <Button className="py-6 w-full px-10 bg bg-gradient-to-r from-[#1DB5E4] to-[#1274CE] border-none hover:from-[#1ba8d3] hover:to-[#126ABC]">
                Join Us Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src="/bgImg.jpg"
            alt="homepage"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      <section className="py-[5em] bg-white ">
        <div className=" w-[90%] lg:w-[80%] m-auto grid lg:grid-cols-[60%,auto] gap-10">
          <div>
            <img src="/stocksExample.jpg" alt="stocks" className="w-full h-full object-cover" />
          </div>

          <div className="self-center">
            <div className="grid gap-5"> <h2 className=" text-black text-3xl font-bold">Explore Trading with Virtual Cash</h2>
              <p className="text-black">Our website lets you practice buying and selling stocks with virtual money, so you can trade without impacting your real funds.</p></div>
          </div>
        </div>
      </section>
      <section className="bg-[#233F59] text-white">
        <div className="w-[90%] lg:w-[80%] m-auto flex flex-row justify-between py-[2em]">
          <a href="#top">
            <img src='/Logo.svg' alt='logo' className='h-5 w-auto' />
          </a>
          <div className="flex flex-row gap-1 text-sm">copyright
            <span className="self-center"><AiOutlineCopyright /></span>
            2024virtutradeHackathon</div>
        </div>
      </section>
      <Link to="/ai" >
        <div className="rounded-full  bg-blue-500 shadow-lg p-5 fixed bottom-[2em] right-[2em] cursor-pointer">
          <FaRobot className="text-white text-3xl" />
        </div>
      </Link>
    </main>
  );
};

export default Homepage;
