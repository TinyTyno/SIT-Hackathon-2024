import React, { useState, initialFormState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RulerHorizontalIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
import StockCalculator from "./stockCalculator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import http from '../../../http.js'
import UserContext from "../../contexts/UserContext";


function SellStockForm({currentPrice}) {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [formData, setFormData] = useState({
        accountID: user.id,
        stock: symbol,
        quantity: 1,
        buysell: 'sell',
        orderType: 'Market', // Default to 'Market'
        price: parseFloat(currentPrice),
        tradeFee: 1.30,
        duration: 'Day',
        extendedHours: false,
    });

    useEffect(() => {
        setFormData(prevData => ({
            ...prevData,
            price: parseFloat(currentPrice) || ''
        }));
    }, [currentPrice]);

    // Handler for input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handler for Select change
    const handleSelectChange = (value, name) => {
        // Check if the order type is changing to 'Market' and reset the form state accordingly
        if (name === 'orderType' && value === 'Market') {
            setFormData({
                ...formData,
                orderType: 'Market',
                price: parseFloat(currentPrice),
                duration: 'Day',
                extendedHours: false
            });
        } else {
        setFormData({
            ...formData,
            [name]: value,
        });
        }
    };

    // Handler for form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);

        // Getting Historical Data
        await http.post(`http://localhost:3000/transactions/addOrder`, formData)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const handleCalculatorUpdate = (calculatedQuantity) => {
        setFormData((prevData) => ({
            ...prevData,
            quantity: calculatedQuantity.toString(), // Ensure the quantity remains a string representation of an integer
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4" style={{textAlign:'left'}}>
            <HoverCard>
                <HoverCardTrigger>
                    <Label htmlFor="orderType">Order Type</Label>
                </HoverCardTrigger>
                <HoverCardContent className="text-xs">
                An order type specifies the conditions under which a trade will be executed.
                <br /><br />
                <b>Market Order</b> executes immediately at the current market price; guarantees execution but not the price.
                <br /><br />
                <b>Limit Order</b> executes at a specified price or better; guarantees price but not execution.
                </HoverCardContent>
            </HoverCard>
            <Select
                value={formData.orderType}
                onValueChange={(value) => handleSelectChange(value, 'orderType')}
            >
                <SelectTrigger style={{marginTop:'3px'}}>
                    <SelectValue>{formData.orderType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Market">Market</SelectItem>
                    <SelectItem value="Limit">Limit</SelectItem>
                </SelectContent>
            </Select>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <HoverCard>
                    <HoverCardTrigger>
                        <Label htmlFor="quantity">Quantity</Label>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                    The number of shares you are buying or selling in a stock trade.
                    </HoverCardContent>
                </HoverCard>
                <HoverCard>
                    <HoverCardTrigger>
                        <Dialog>
                            <DialogTrigger>
                                <RulerHorizontalIcon />
                            </DialogTrigger>
                            <DialogContent>
                                <StockCalculator currentPrice={formData.price} onCalculate={handleCalculatorUpdate} />
                            </DialogContent>
                        </Dialog>

                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                        Calculator to determine the number of shares you can buy based on the amount you are willing to spend.
                    </HoverCardContent>
                </HoverCard>
                <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Quantity"
                    min="1"
                    required
                />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <HoverCard>
                    <HoverCardTrigger>
                        <Label htmlFor="price">Price</Label>
                    </HoverCardTrigger>
                    <HoverCardContent className="text-xs">
                    The amount you are willing to pay per share (for buying) or receive per share (for selling).                    
                    </HoverCardContent>
                </HoverCard>
                <Input
                    disabled = {formData.orderType === 'Market'}
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Price"
                    style={{marginBottom:'9px'}}
                />
            </div>
            <HoverCard>
                <HoverCardTrigger>
                    <Label htmlFor="duration">Duration</Label>
                </HoverCardTrigger>
                <HoverCardContent className="text-xs">
                How long your order remains active.
                <br /><br />
                <b>Day</b> order is active only for the trading day.
                <br /><br />
                <b>GTC</b> order remains active until it is executed or canceled.                
                </HoverCardContent>
             </HoverCard>

            <Select
                disabled = {formData.orderType === 'Market'}
                value={formData.duration}
                onValueChange={(value) => handleSelectChange(value, 'duration')}
            >
                <SelectTrigger style={{marginTop:'3px'}}>
                    <SelectValue>{formData.duration || 'Select Duration'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Day">Day</SelectItem>
                    <SelectItem value="GTC">GTC</SelectItem>
                </SelectContent>
            </Select>
            {formData.orderType === 'Limit' && (
                <div>
                    <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                            id="extendedHours"
                            name="extendedHours"
                            checked={formData.extendedHours}
                            onChange={handleInputChange}
                        />
                        <HoverCard>
                            <HoverCardTrigger>
                                <Label htmlFor="extendedHours" className="text-sm font-medium leading-none">Extended Hours</Label>
                            </HoverCardTrigger>
                            <HoverCardContent className="text-xs">
                            In the case that your limit order is not fulfilled during regular market hours, extended hours fulfills your orders after regular market hours. 
                            Higher risk due to lower liquidity and higher volatility.
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            )}
                        <Dialog>
                <DialogTrigger>
                    <Button type='button' className="m-2 bg-rose-800">Sell Stock</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Review Details</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Account ID</TableCell>
                                    <TableCell>{formData.accountID}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Buy/Sell</TableCell>
                                    <TableCell>Sell</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>{symbol}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Order Type</TableCell>
                                    <TableCell>{formData.orderType}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>{formData.quantity}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell>{formData.price}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Trade Fee</TableCell>
                                    <TableCell>1.30 USD</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>{formData.duration}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Extended Hours</TableCell>
                                    <TableCell>{formData.extendedHours ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total</TableCell>
                                    <TableCell>{(formData.price * formData.quantity + 1.30).toFixed(2)} USD</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </DialogDescription>
                    <div className="flex justify-end">
                        <Button className="m-2" type="button" onClick={(e) => {handleSubmit(e);navigate('/orders');}}>Sell</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Button className="m-2" type="input" onClick={() => navigate(`../../stock/${symbol}`)}>Cancel</Button>
        </form>
    );
}

export default SellStockForm;
