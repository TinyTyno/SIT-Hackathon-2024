import express, { response } from 'express';
import db from '../models/model_index.js';
import UserStock from '../models/UserStock.js';
import Order from '../models/Order.js';
import axios from 'axios';

const StockTransactionRouter = express.Router();

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

async function checkStockPrice(stock) {
    const uri = `https://data.alpaca.markets/v2/stocks/bars?symbols=${stock}&timeframe=1D&limit=10000&adjustment=raw&feed=sip&sort=asc`;
    const options = {
        method: 'GET',
        url: encodeURI(uri),
        headers: {
            accept: 'application/json',
            'APCA-API-KEY-ID': process.env.APCA_API_KEY_ID,
            'APCA-API-SECRET-KEY': process.env.APCA_API_SECRET_KEY,
        },
    };

    try {
        const response = await axios.request(options); // Await the request to complete
        const currentPrice = response.data.bars[stock.toUpperCase()][0]['c'];
        return currentPrice; // Return the current price correctly

    } catch (error) {
        console.error('Error fetching stock price:', error);
        return undefined; // Return undefined if there's an error
    }
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

setInterval(checkLimitOrder, 5000);

async function fulfillOrder(orderId) {
    const order = await db.Order.findOne({
        where: {
            id: orderId
        }
    });
    // update order status to fulfilled
    order.status = 'fulfilled';

    // minus from cash balance of user
    updateCashBalance(order.accountID, -1 * order.price * quantity - order.tradeFee);
    
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

        else if (userStock.quantity + quantity < 0 && userStock.quantity + quantity < userStock.quantity) {
            // further selling, no position closing, update price bought
            userStock.priceBought = (userStock.priceBought * userStock.quantity + order.price * quantity) / (userStock.quantity + quantity);
            userStock.quantity += quantity;
        }
        else if (userStock.quantity + quantity < 0 && userStock.quantity + quantity > userStock.quantity) {
            // partial position closing (buying), add to cash balance of user
            userStock.quantity += quantity;
            updateCashBalance(order.accountID, order.price * quantity);
        }
        else if (userStock.quantity + quantity > 0 && userStock.quantity + quantity > userStock.quantity) {
            // further buying, no position closing, update price bought
            console.log('userstock further buying' + userStock)
            userStock.priceBought = (userStock.priceBought * userStock.quantity + order.price * quantity) / (userStock.quantity + quantity);
            userStock.quantity += quantity;
        }
        else if (userStock.quantity + quantity > 0 && userStock.quantity + quantity < userStock.quantity) {
            // partial position closing (selling), add to cash balance of user
            userStock.quantity += quantity;
            // find out current price of stock
            updateCashBalance(order.accountID, order.price * quantity * -1);
        }
        await userStock.save();
    }
    await order.save();
}

async function getCashBalance(accountID) {
    // const user = await db.User.findOne({
    //     where: {
    //         id: accountID
    //     }
    // });
    // return user.cashBalance;
    return 100000;
}

async function updateCashBalance(accountID, amount) {
    // const user = await db.User.findOne({
    //     where: {
    //         id: accountID
    //     }
    // });
    // user.cashBalance += amount;
}

export default StockTransactionRouter;