import React, { useEffect, useState } from 'react';
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

function ViewOrder() {
    const { query } = useParams();
    const navigate = useNavigate();

    const [ordersList, setOrdersList] = useState([]);

    useEffect(() => {
        fetchData();
    }, [query]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/transactions/getOrders?id=123456789`);
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
            <span style={{marginLeft:'2rem', fontSize:'1.5rem', fontWeight:'800', marginTop:'1rem'}}>Order History</span>
            <Table style={{ maxHeight: '60vh', width: '60vw', marginLeft:'2rem', marginTop: '1.5rem' }}>
            <TableCaption>List of order history</TableCaption>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Date Time</TableHead>
                <TableHead>Order Type</TableHead>
                <TableHead>Buy/Sell</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Trade Fee</TableHead>
                <TableHead>Status</TableHead>
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
