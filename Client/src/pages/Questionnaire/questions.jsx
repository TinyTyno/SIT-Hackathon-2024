import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SearchStockInput from '@/components/stockPage/SearchStockInput';
import StableSidebar from '@/components/StableSidebar';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"

function Questions() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        riskTolerance: "",
        investmentAmount: "",
        newsAwareness: "",
        investmentGoals: "",
        experience: "",
        marketVolatility: "",
        liquidityNeeds: "",
        expectedReturns: "",
        timeCommitment: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const calculateScore = () => {
        const scores = {
            riskTolerance: parseInt(formData.riskTolerance) || 0,
            investmentAmount: parseInt(formData.investmentAmount) || 0,
            newsAwareness: parseInt(formData.newsAwareness) || 0,
            investmentGoals: parseInt(formData.investmentGoals) || 0,
            experience: parseInt(formData.experience) || 0,
            marketVolatility: parseInt(formData.marketVolatility) || 0,
            liquidityNeeds: parseInt(formData.liquidityNeeds) || 0,
            expectedReturns: parseInt(formData.expectedReturns) || 0,
            timeCommitment: parseInt(formData.timeCommitment) || 0,
        };
        
        return Object.values(scores).reduce((total, score) => total + score, 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalScore = calculateScore();
        setScore(totalScore);

        let investorType = '';
        let description = '';
        let suggestions = '';

        if (totalScore >= -9 && totalScore <= -4) {
            investorType = 'Conservative Investor';
            description = 'Low risk tolerance, prioritizes capital preservation, prefers stable and low-risk investments, focused on preserving wealth and steady returns.';
            suggestions = `You may consider investing in Government Bonds,
             Certificates of Deposit (CDs), Fixed Annuities.`;
        } else if (totalScore >= -3 && totalScore <= 3) {
            investorType = 'Balanced Investor';
            description = 'Moderate risk tolerance, seeks a mix of growth and income, open to both long-term and short-term investments, maintains a balanced portfolio.';
            suggestions = 'You may consider investing in Balanced Mutual Funds, Exchange-Traded Funds, Investment-grade Bonds.';
        } else if (totalScore >= 4 && totalScore <= 9) {
            investorType = 'Growth Investor';
            description = 'High risk tolerance, seeks high returns, comfortable with market volatility, prefers growth-oriented investments.';
            suggestions = `You may consider investing in 
            <b>Stocks</b>, Cryptocurrencies, and Commodities.`;
        }

        // setResult({investorType, description, suggestions});
        setSubmitted(true);
    };
    if (submitted && (score >= -9 && score <= -4)) {
        return (
            <StableSidebar>
                <div className='container'>
                    <SearchStockInput />
                    <div style={{marginLeft:'2.5rem', marginTop:'2rem'}}>
                        <h1 className='mb-4 text-2xl'>You are a: <b>Conservative Investor</b></h1>
                        <h3>You have low risk tolerance, prioritizes capital preservation, prefers stable and low-risk investments, focused on preserving wealth and steady returns.</h3>
                        <h3 className='mt-3 mb-4'>
                            You may consider investing in 
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Government Bonds,</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Loans to the government, which promises to pay you back with interest</HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Certificates of Deposit (CDs), </span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Savings accounts with a fixed interest rate and term, offered by banks. Your money is locked in for a specific period.</HoverCardContent>
                            </HoverCard>
                            and
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Fixed Annuities.</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Insurance products that provide regular, guaranteed payments over time in exchange for a lump sum payment upfront.</HoverCardContent>
                            </HoverCard>
                        </h3>
                        <Button onClick={() => setSubmitted(false)} className="mt-4">Redo Form</Button>
                    </div>
                </div>
            </StableSidebar>
        )
    }
    else if (submitted && (score >= -3 && score <= 3)) {
        return (
            <StableSidebar>
                <div className='container'>
                    <SearchStockInput />
                    <div style={{marginLeft:'2.5rem', marginTop:'2rem'}}>
                        <h1 className='mb-4 text-2xl'>You are a: <b>Balanced Investor</b></h1>
                        <h3>You have Moderate risk tolerance, seeks a mix of growth and income, open to both long-term and short-term investments, maintains a balanced portfolio.</h3>
                        <h3 className='mt-3 mb-4'>
                            You may consider investing in
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Balanced Mutual Funds,</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>A Mutual Fund is a collection of money from many people, managed by professionals and invested in various assets to grow over time and provide returns to investors. Balanced Mutual Funds are Funds that invest in a mix of stocks and bonds</HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Exchange-Traded Funds,</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Funds that track an index, offering a way to invest in a broad range of assets (e.g. SGX).</HoverCardContent>
                            </HoverCard>
                            and
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Investment-grade Bonds.</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>An investment where you lend money to companies that have a high credit rating. The company repays you with a fixed interest in addition to the original face value of the bond.</HoverCardContent>
                            </HoverCard>
                        </h3>
                        <Button onClick={() => setSubmitted(false)} className="mt-4">Redo Form</Button>
                    </div>
                </div>
            </StableSidebar>
        )
    }
    else if (submitted && (score >= 4 && score <= 9)) {
        return (
            <StableSidebar>
                <div className='container'>
                    <SearchStockInput />
                    <div style={{marginLeft:'2.5rem', marginTop:'2rem'}}>
                        <h1 className='mb-4 text-2xl'>You are a: <b>Growth Investor</b></h1>
                        <h3>You have High risk tolerance, seeks high returns, comfortable with market volatility, prefers growth-oriented investments.</h3>
                        <h3 className='mt-3 mb-4'>
                            You may consider investing in
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Stocks,</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Shares in a company</HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Cryptocurrencies,</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Digital or virtual currencies like Bitcoin or Ethereum that use cryptography for security</HoverCardContent>
                            </HoverCard>
                            and
                            <HoverCard>
                                <HoverCardTrigger><span className='font-semibold'> Commodities.</span></HoverCardTrigger>
                                <HoverCardContent className='text-sm'>Investments in physical goods like gold, oil or agricultural products</HoverCardContent>
                            </HoverCard>
                        </h3>
                        <Button onClick={() => setSubmitted(false)} className="mt-4">Redo Form</Button>
                    </div>
                </div>
            </StableSidebar>
        )
    }

    return (
        <StableSidebar>
            <div className='container'>
                <SearchStockInput />
                <div style={{marginLeft:'2.5rem', marginTop:'2rem'}}>
                    <h1 className='font-bold mb-2 text-4xl'>Investor Insight</h1>
                    <h3>Take this short survey to find out your risk profile and what type of investments you should go for.</h3>
                    <form className='mt-6' onSubmit={handleSubmit}>
                        {/* Risk Tolerance */}
                        <RadioGroup name="riskTolerance" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How do you feel about taking risks with your investments?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="risk-tolerance-high" />
                                <Label htmlFor="risk-tolerance-high" className='font-normal'>I am comfortable with high-risk investments for potentially high returns.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="risk-tolerance-moderate" />
                                <Label htmlFor="risk-tolerance-moderate" className='font-normal'>I prefer moderate risks with balanced returns.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="risk-tolerance-low" />
                                <Label htmlFor="risk-tolerance-low" className='font-normal'>I am only comfortable with low-risk investments to preserve my capital.</Label>
                            </div>
                        </RadioGroup>

                        {/* Investment Amount */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="investmentAmount" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How much are you willing to invest initially?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="investment-amount-large" />
                                <Label htmlFor="investment-amount-large" className='font-normal'>I am willing to invest a large amount. ($50000 and above)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="investment-amount-moderate" />
                                <Label htmlFor="investment-amount-moderate" className='font-normal'>I am willing to invest a moderate amount. ($10000 to $49999)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="investment-amount-small" />
                                <Label htmlFor="investment-amount-small" className='font-normal'>I am only comfortable investing a small amount. (Under $10000)</Label>
                            </div>
                        </RadioGroup>

                        {/* Awareness of Current News */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="newsAwareness" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How up-to-date are you with financial news and market trends?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="news-awareness-active" />
                                <Label htmlFor="news-awareness-active" className='font-normal'>I actively follow financial news and stay informed about market trends.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="news-awareness-occasional" />
                                <Label htmlFor="news-awareness-occasional" className='font-normal'>I occasionally follow financial news.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="news-awareness-rarely" />
                                <Label htmlFor="news-awareness-rarely" className='font-normal'>I rarely follow financial news.</Label>
                            </div>
                        </RadioGroup>

                        {/* Investment Goals */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="investmentGoals" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>What is your primary goal for investing?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="investment-goals-aggressive" />
                                <Label htmlFor="investment-goals-aggressive" className='font-normal'>Aggressive growth – I want high returns even if it means taking more risk.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="investment-goals-moderate" />
                                <Label htmlFor="investment-goals-moderate" className='font-normal'>Moderate growth – I want balanced returns with moderate risk.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="investment-goals-preservation" />
                                <Label htmlFor="investment-goals-preservation" className='font-normal'>Capital preservation – I want to protect my investment, even if returns are lower.</Label>
                            </div>
                        </RadioGroup>

                        {/* Investment Experience */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="experience" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How would you describe your level of investment experience?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="experience-expert" />
                                <Label htmlFor="experience-expert" className='font-normal'>Expert – I have extensive experience with various investments.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="experience-intermediate" />
                                <Label htmlFor="experience-intermediate" className='font-normal'>Intermediate – I have some experience but still learning.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="experience-beginner" />
                                <Label htmlFor="experience-beginner" className='font-normal'>Beginner – I am new to investing.</Label>
                            </div>
                        </RadioGroup>

                        {/* Reaction to Market Volatility */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="marketVolatility" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How do you typically react to market fluctuations?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="market-volatility-calm" />
                                <Label htmlFor="market-volatility-calm" className='font-normal'>I remain calm and view them as opportunities.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="market-volatility-cautious" />
                                <Label htmlFor="market-volatility-cautious" className='font-normal'>I am cautious but can tolerate moderate fluctuations.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="market-volatility-concerned" />
                                <Label htmlFor="market-volatility-concerned" className='font-normal'>I am very concerned and prefer stable investments.</Label>
                            </div>
                        </RadioGroup>

                        {/* Liquidity Needs */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="liquidityNeeds" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How important is liquidity (easy access to cash) to you?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="liquidity-needs-important" />
                                <Label htmlFor="liquidity-needs-important" className='font-normal'>Very important; I need to be able to access my funds quickly.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="liquidity-needs-moderate" />
                                <Label htmlFor="liquidity-needs-moderate" className='font-normal'>Moderately important; I can manage with some restrictions.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="liquidity-needs-not-important" />
                                <Label htmlFor="liquidity-needs-not-important" className='font-normal'>Not important; I am comfortable with less liquid investments.</Label>
                            </div>
                        </RadioGroup>

                        {/* Expected Returns */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="expectedReturns" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>What kind of annual return do you expect from your investments?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="expected-returns-high" />
                                <Label htmlFor="expected-returns-high" className='font-normal'>More than 15% – I’m willing to take high risks.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="expected-returns-moderate" />
                                <Label htmlFor="expected-returns-moderate" className='font-normal'>8-15% – I want reasonable returns with moderate risk.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="expected-returns-low" />
                                <Label htmlFor="expected-returns-low" className='font-normal'>1-7% – I prefer safe investments with lower returns.</Label>
                            </div>
                        </RadioGroup>

                        {/* Investment Time Commitment */}
                        <RadioGroup style={{marginTop:'1.5rem'}} name="timeCommitment" onChange={handleChange} required>
                            <Label className='text-lg mb-2 font-medium'>How much time are you willing to dedicate to managing your investments?</Label>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="1" id="time-commitment-lot" />
                                <Label htmlFor="time-commitment-lot" className='font-normal'>A lot – I enjoy monitoring and adjusting my portfolio frequently.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="0" id="time-commitment-some" />
                                <Label htmlFor="time-commitment-some" className='font-normal'>Some – I can check in occasionally but not too often.</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="-1" id="time-commitment-minimal" />
                                <Label htmlFor="time-commitment-minimal" className='font-normal'>Minimal – I prefer a set-and-forget approach.</Label>
                            </div>
                        </RadioGroup>

                        <Button type="submit" className="mt-4">Submit</Button>
                    </form>
                </div>
            </div>
        </StableSidebar>
    );
}

export default Questions;
