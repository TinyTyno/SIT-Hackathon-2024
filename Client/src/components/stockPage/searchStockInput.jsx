import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Ensure Button is properly imported

function SearchStockInput() {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    // Handle input change
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(inputValue);
        navigate('/search/' + inputValue);
        // Add API call or logic to handle search here
    };

    return (
        <div className="flex w-full max-w-sm items-center space-x-2" style={{marginBottom:'4rem', paddingTop:'2rem', marginLeft: '2rem'}}>
            <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
                <Input 
                    value={inputValue} 
                    onChange={handleInputChange} 
                    type="text" 
                    placeholder="Search using a stock symbol" 
                />
                <Button type="submit">Search</Button> {/* Ensure Button is correctly used */}
            </form>
        </div>
    );
}

export default SearchStockInput;
