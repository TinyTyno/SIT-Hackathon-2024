// StockCalculator.js
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';

function StockCalculator({ currentPrice, onCalculate }) {
    const [amount, setAmount] = useState('');
    const [numberOfShares, setNumberOfShares] = useState(''); // State to hold the calculated shares

    // Calculate the number of shares based on the amount and the current stock price
    const handleCalculate = () => {
        console.log('currentPrice', currentPrice, 'amount', amount);
        if (!amount || currentPrice <= 0) return;
        const numberOfShares = Math.floor(parseFloat(amount) / currentPrice); // Only whole shares
        onCalculate(numberOfShares); // Send the calculated shares back to the parent component
        setNumberOfShares(numberOfShares);
    };

    return (
        <div className="space-y-4 p-4" style={{width:'80vh'}}>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right">
                    Amount to Invest
                </Label>
                <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in $"
                    min="1"
                    required
                    className="w-40"
                />
                <Button onClick={handleCalculate} className="bg-blue-500 text-white rounded hover:bg-blue-600" style={{marginLeft:'2rem'}}>
                    Calculate
                </Button>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right">
                    Number of Shares
                </Label>
                <Input
                    type="number"
                    value={numberOfShares}
                    readOnly
                    className="w-40"
                />
            </div>
        </div>
    );
}

export default StockCalculator;
