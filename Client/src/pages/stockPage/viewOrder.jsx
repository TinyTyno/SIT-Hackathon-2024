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
import UserContext from "../../contexts/UserContext";

function ViewOrder() {
    const { query } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [ordersList, setOrdersList] = useState([]);

    // Fetch data on component load and when query changes
    useEffect(() => {
        fetchData();
        // Optionally set up polling
        const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [query]);

    // Function to fetch order data
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/transactions/getOrders?id=${user.id}`);
            const data = response.data;
            setOrdersList(data.reverse());
        } 
        catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Helper function to capitalize the first letter of a string
    const capitalizeFirstLetter = (string) => {
        if (typeof string !== 'string' || string.length === 0) return string;
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Table output component
    function TableOutput() {
        if (!Array.isArray(ordersList) || ordersList.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan="8">No data available or failed to fetch.</TableCell>
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

    return (
        <StableSidebar>
            <div className='Container'>
                <SearchStockInput />
                <span style={{display:'block', marginLeft:'2.5rem', fontSize:'1.5rem', fontWeight:'800', marginTop:'2rem'}}>Order History</span>
                <Table style={{ maxHeight: '60vh', marginLeft:'2.5rem',width: '60vw', marginTop: '1.5rem' }}>
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
                                    </HoverCardContent>
                                </HoverCard>
                            </TableHead>
                            <TableHead>
                                <HoverCard>
                                    <HoverCardTrigger>Buy/Sell</HoverCardTrigger>
                                    <HoverCardContent className="text-xs">
                                        Indicates whether the transaction was a buy or sell order.
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
                                        The price at which you bought or sold the stock per share.
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
