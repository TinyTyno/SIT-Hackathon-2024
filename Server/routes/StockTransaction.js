import express, { response } from 'express';
import db from '../models/model_index.js';
import UserStock from '../models/UserStock.js';
import Order from '../models/Order.js';
import axios from 'axios';
import finnhub from 'finnhub';

const StockTransactionRouter = express.Router();

StockTransactionRouter.get('/getUserStocks', async (req, res) => {
    const accountID = req.query.id;
    const userStocks = await db.UserStock.findAll({
        where: {
            accountID: accountID
        }
    });
    res.json(userStocks);
});

StockTransactionRouter.get('/getOrders', async (req, res) => {
    const accountID = req.query.id;
    const orders = await db.Order.findAll({
        where: {
            accountID: accountID
        }
    });
    res.json(orders);
});

StockTransactionRouter.post('/addOrder', async (req, res) => {
    const { accountID, stock, quantity, buysell, orderType, price, tradeFee, duration, extendedhours } = req.body;
    // Check if user has enough cash balance to make the order
    const cashBalance = await getCashBalance(accountID);
    if (price * quantity + tradeFee > cashBalance) {
        res.status(400).send('Insufficient funds');
        return;
    }
    const order = await db.Order.create({
        accountID: accountID,
        dateTime: new Date(),
        stock: stock,
        quantity: quantity,
        buySell: buysell,
        ordertype: orderType,
        price: price,
        tradeFee: tradeFee,
        duration: duration,
        extendedhours: extendedhours,
        status: 'pending'
    });
    res.status(200).send("Order created successfully");
    if (orderType == 'Market') {
        fulfillOrder(order.id);
    }
});

async function checkStockPrice(stock) {
    // const uri = `https://data.alpaca.markets/v2/stocks/bars?symbols=${stock}&timeframe=1D&limit=10000&adjustment=raw&feed=sip&sort=asc`;
    // const options = {
    //     method: 'GET',
    //     url: encodeURI(uri),
    //     headers: {
    //         accept: 'application/json',
    //         'APCA-API-KEY-ID': process.env.APCA_API_KEY_ID,
    //         'APCA-API-SECRET-KEY': process.env.APCA_API_SECRET_KEY,
    //     },
    // };

    // try {
    //     const response = await axios.request(options); // Await the request to complete
    //     console.log('Response:', response);
    //     const currentPrice = response.data.bars[stock.toUpperCase()][0]['c'];
    //     console.log('Current price:', currentPrice);
    //     return currentPrice; // Return the current price correctly

    // } catch (error) {
    //     console.error('Error fetching stock price:', error);
    //     return undefined; // Return undefined if there's an error
    // }
    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = process.env.FINNHUB_API_KEY;
    const finnhubClient = new finnhub.DefaultApi()

    finnhubClient.quote(stock, (error, data, response) => {
        if (error) {
            console.log(error);
            return undefined
        }
        else {
            return (data["c"])
        }
    });
}

async function checkLimitOrder() {
    const orders = await db.Order.findAll({
        where: {
            ordertype: 'limit',
            status: 'pending'
        }
    });
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        order = order.dataValues;
        const cashBalance = await getCashBalance(order.accountID);
        var currentPrice = await checkStockPrice(order.stock);
        if (parseFloat(order.price) * parseInt(order.quantity) + parseFloat(order.tradeFee) > parseFloat(cashBalance)) {
            console.log('Insufficient funds');
        }
        else if (parseFloat(order.price) == parseFloat(currentPrice)) {
            console.log('Fulfilling Limit order!')
            fulfillOrder(order.id);
        }
    }
    // Check if the current price of the stock is less than the limit price, and check if order is pending
    // If it is, fulfill the order
}

setInterval(checkLimitOrder, 10000);

async function fulfillOrder(orderId) {
    const order = await db.Order.findOne({
        where: {
            id: orderId
        }
    });
    // update order status to fulfilled
    order.status = 'fulfilled';

    // minus from cash balance of user
    var amountDeducted = -1 * parseFloat(order.price) * parseFloat(order.quantity) - parseFloat(order.tradeFee);
    console.log('amount to be deducted is', amountDeducted)
    updateCashBalance(order.accountID, amountDeducted);
    
    // Checks if the order is a buy or sell order
    var quantity = order.quantity;
    if ((order.buySell).toLowerCase() == 'sell') {
        quantity = quantity * -1;
    }

    const userStock = await db.UserStock.findOne({
        where: {
            accountID: order.accountID,
            stock: order.stock
        }
    });
    if (userStock == null) {
        const newUserStock = await db.UserStock.create({
            accountID: order.accountID,
            stock: order.stock,
            quantity: quantity,
            priceBought: order.price
        });
    }
    else {
        if (userStock.quantity + quantity == 0) {
            await db.UserStock.destroy({
                where: {
                    accountID: order.accountID,
                    stock: order.stock
                }
            });
            if (quantity < 0) {
                // Selling
                quantity = quantity * -1;
            }
            updateCashBalance(order.accountID, order.price * quantity);
            // Close position and add to cash balance of user function here
        }

        else if (userStock.quantity < 0 && userStock.quantity + quantity < 0 && userStock.quantity > userStock.quantity + quantity ) {
            // further selling (e.g. -17 to -27), no position closing, update price bought
            userStock.priceBought = (userStock.priceBought * userStock.quantity + order.price * quantity) / (userStock.quantity + quantity);
            userStock.quantity += quantity;
        }
        else if (userStock.quantity < 0 && userStock.quantity + quantity < 0 && userStock.quantity < userStock.quantity + quantity) {
            // partial position closing (buying) in negative value (e.g. -27 to -17), add to cash balance of user
            userStock.quantity += quantity;
            updateCashBalance(order.accountID, order.price * quantity); // Adding back into cash balance
        }
        else if (userStock.quantity > 0 && userStock.quantity + quantity > 0 && userStock.quantity < userStock.quantity + quantity) {
            // further buying (e.g. 17 to 27), no position closing, update price bought
            console.log('userstock further buying' + userStock)
            userStock.priceBought = (userStock.priceBought * userStock.quantity + order.price * quantity) / (userStock.quantity + quantity);
            userStock.quantity += quantity;
        }
        else if (userStock.quantity > 0 && userStock.quantity + quantity > 0 && userStock.quantity > userStock.quantity + quantity) {
            // partial position closing (selling) (27 to 17), add to cash balance of user
            userStock.quantity += quantity;
            // find out current price of stock
            updateCashBalance(order.accountID, order.price * quantity * -1);
        }
        else if (userStock.quantity < 0 && userStock.quantity + quantity > 0) {
            // Full reversal of position from selling to buying (e.g. -17 to 27, difference of 44)
            // Close selling position and add to cash balance of user
            // Open buying position

            updateCashBalance(order.accountID, order.price * userStock.quantity * -1);  // Add back to cash balance of user

            userStock.priceBought = order.price; // Sets price bought to current price
            userStock.quantity += quantity;
        }
        else if (userStock.quantity > 0 && userStock.quantity + quantity < 0) {
            // Full reversal of position from buying to selling (e.g. 27 to -17)
            // Close buying position and add to cash balance of user
            // Open selling position
            updateCashBalance(order.accountID, order.price * userStock.quantity);  // Add back to cash balance of user

            userStock.priceBought = order.price; // Sets price bought to current price
            userStock.quantity += quantity;
        }
        await userStock.save();
    }
    await order.save();
}

async function getCashBalance(accountID) {
    const user = await db.User.findOne({
        where: {
            id: accountID
        }
    });
    return user.cashBalance;
}

StockTransactionRouter.get('/getCashBalance', async (req, res) => {
    const accountID = req.query.id;
    const cashBalance = await getCashBalance(accountID);
    res.json(cashBalance);
});

async function updateCashBalance(accountID, amount) {
    const user = await db.User.findOne({
        where: {
            id: accountID
        }
    });
    console.log('cash balance is ' + user.cashBalance, 'cash balance type is', typeof(user.cashBalance))
    console.log('amount is ' + amount, 'amount type is', typeof(amount))
    user.cashBalance = parseFloat(user.cashBalance) + parseFloat(amount);
    await user.save();
}


// StockTransactionRouter.post('/fulfillOrder', async (req, res) => {
//     const { orderId } = req.body;
//     // get other variables from order using orderid
//     const order = await db.Order.findOne({
//         where: {
//             id: orderId
//         }
//     });
//     // update order status to fulfilled
//     order.status = 'fulfilled';
//     res.json(order);

//     // Checks if the order is a buy or sell order
//     var quantity = order.quantity;
//     if (order.buySell == 'sell') {
//         quantity = quantity * -1;
//     }

//     // minus from cash balance of user
//     updateCashBalance(order.accountID, -1 * order.price * quantity - order.tradeFee);

//     const userStock = await db.UserStock.findOne({
//         where: {
//             accountID: order.accountID,
//             stock: order.stock
//         }
//     });
//     console.log(userStock);
//     if (userStock == null) {
//         const newUserStock = await db.UserStock.create({
//             accountID: order.accountID,
//             stock: order.stock,
//             quantity: quantity,
//             priceBought: order.price
//         });
//     }
//     else {
//         if (userStock.quantity + quantity == 0) {
//             await db.UserStock.destroy({
//                 where: {
//                     accountID: order.accountID,
//                     stock: order.stock
//                 }
//             });
//             if (quantity < 0) {
//                 // Selling
//                 quantity = quantity * -1;
//             }
//             updateCashBalance(order.accountID, order.price * quantity);
//             // Close position and add to cash balance of user function here
//         }

//         else if (userStock.quantity + quantity < 0 && userStock.quantity + quantity < userStock.quantity) {
//             // further selling, no position closing, update price bought
//             userStock.quantity += quantity;
//             userStock.priceBought = (userStock.priceBought * userStock.quantity + order.price * quantity) / userStock.quantity;
//         }
//         else if (userStock.quantity + quantity < 0 && userStock.quantity + quantity > userStock.quantity) {
//             // partial position closing (buying), add to cash balance of user
//             userStock.quantity += quantity;
//             updateCashBalance(order.accountID, order.price * quantity);
//         }
//         else if (userStock.quantity + quantity > 0 && userStock.quantity + quantity > userStock.quantity) {
//             // further buying, no position closing, update price bought
//             userStock.quantity += quantity;
//             userStock.priceBought = (userStock.priceBought * userStock.quantity + order.price * quantity) / userStock.quantity;
//         }
//         else if (userStock.quantity + quantity > 0 && userStock.quantity + quantity < userStock.quantity) {
//             // partial position closing (selling), add to cash balance of user
//             userStock.quantity += quantity;
//             // find out current price of stock
//             updateCashBalance(order.accountID, order.price * quantity * -1);
//         }

//     }

//     // Check if id and stock exists in UserStock model
//     // If it does, update the quantity and price bought with a special formula. If quantity is 0, delete the entry
//     // Buying adds 1 quantity, selling subtracts 1 quantity, can go to negative
//     // TO note for calculating p/l: if quantity < 0, use selling formula, if quantity > 0, use buying formula
//     // For closing position, is just the opposite until quantity is 0
//     // If not, create a new UserStock Entry
// });


export default StockTransactionRouter;



