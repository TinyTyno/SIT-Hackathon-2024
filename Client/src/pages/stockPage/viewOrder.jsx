import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SearchStockInput from '@/components/stockPage/searchStockInput';
import StableSidebar from '@/components/StableSidebar';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import http from '../../../http.js'
import { Tab } from '@chakra-ui/react';
import UserContext from "../../contexts/UserContext";

function ViewOrder() {
    const { query } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [ordersList, setOrdersList] = useState([]);

    useEffect(() => {
        fetchData();
    }, [query]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/transactions/getOrders?id=${user.id}`);
            const data = response.data;
            setOrdersList(data.reverse());
            console.log('orders list is' + ordersList)
        } 
        catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    function TableOutput() {
        // Check if stockList contains valid objects
        if (!Array.isArray(ordersList) || ordersList.length === 0) {
        return (
            <TableRow>
            <TableCell colSpan="4">No data available or failed to fetch.</TableCell>
            </TableRow>
        );
        }

        return ordersList.map((order, index) => (
        <TableRow key={index}>
            <TableCell>{new Date(order.dateTime).toLocaleString()}</TableCell>
            <TableCell>{capitalizeFirstLetter(order.ordertype)}</TableCell>
            <TableCell>{capitalizeFirstLetter(order.buySell)}</TableCell>
            <TableCell onClick={() => navigate(`/stock/${order.stock}`)}>{order.stock}</TableCell>
            <TableCell>{order.quantity}</TableCell>
            <TableCell>{order.price}</TableCell>
            <TableCell>{order.tradeFee}</TableCell>
            <TableCell>{capitalizeFirstLetter(order.status)}</TableCell>
        </TableRow>
        ));
    }

    const capitalizeFirstLetter = (string) => {
        if (typeof string !== 'string' || string.length === 0) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
      };
      
    return (
        <StableSidebar>
        <div className='Container'>
            <SearchStockInput />
            <span style={{display:'block', marginLeft:'2rem', fontSize:'1.5rem', fontWeight:'800', marginTop:'2rem'}}>Order History</span>
            <Table style={{ maxHeight: '60vh', width: '60vw', marginLeft:'2rem', marginTop: '1.5rem' }}>
            <TableCaption>List of order history</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Date Time</HoverCardTrigger>                    
                            <HoverCardContent className="text-xs">
                                The date and time at which the order was requested.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Order Type</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                An order type specifies the conditions under which a trade will be executed.
                                <br /><br />
                                <b>Market Order</b> executes immediately at the current market price; guarantees execution but not the price.
                                <br /><br />
                                <b>Limit Order</b> executes at a specified price or better; guarantees price but not execution.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Buy/Sell</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                Buying a stock means betting that its price will go up.
                                If the price rises, you profit, but if it falls, you incur a loss.
                                <br /> <br />
                                Selling a stock means betting that its price will go down.
                                If the price falls, you profit, but if it rises, you incur a loss.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Stock</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The stock that you are trading represented by its stock symbol.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Quantity</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The number of shares that you are buying or selling.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Price</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The price at which which you bought or sold the stock per share.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Trade Fee</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The fee charged by the broker for executing the trade.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                    <TableHead>
                        <HoverCard>
                            <HoverCardTrigger>Status</HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                                The status of the order.
                            </HoverCardContent>
                        </HoverCard>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableOutput />
            </TableBody>
            </Table>
        </div>
        </StableSidebar>
    );
}

export default ViewOrder;
