import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StockCard = ({ name, desc, amount, pl, percent, duration }) => {
  return (
    <Card className="">
      <CardHeader className="pt-6 pb-3">
        <CardTitle className="text-3xl">{name}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-6xl font-semibold">{amount}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row gap-1">
          <span className="text-green-600">{pl}</span>
          <span className="text-green-600">({percent})</span>
          <span>{duration}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StockCard;
