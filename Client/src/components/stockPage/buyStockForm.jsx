import React, { useState, initialFormState } from "react";
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
  

function BuyStockForm() {
    const { symbol } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        orderType: 'Market', // Default to 'Market'
        quantity: '',
        price: 119.42,
        duration: 'Day',
        extendedHours: false,
    });

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
                price: 119.42,
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
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form data submitted:', formData);
        // Add your submission logic here
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

            <Button className="m-2 bg-emerald-800" type="submit">Buy Stock</Button>
            <Button className="m-2" type="input" onClick={() => navigate(`../../stock/${symbol}`)}>Cancel</Button>
        </form>
    );
}

export default BuyStockForm;
