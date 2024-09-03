export default (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        buySell: {
            type: DataTypes.ENUM('buy', 'sell'),
            allowNull: false,
        },
        stock: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
            },
        },
        ordertype: {
            type: DataTypes.ENUM('limit', 'market'),
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        tradeFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        duration: {
            type: DataTypes.ENUM('day', 'gtc'), // 'gtc' = Good 'Til Canceled
            allowNull: false,
            defaultValue: 'day',
        },
        extendedhours: {
            type: DataTypes.ENUM('y', 'n'),
            allowNull: false,
            defaultValue: 'n',
        },
        status: {
            type: DataTypes.ENUM('fulfilled', 'pending', 'cancelled'),
            allowNull: false,
            defaultValue: 'pending',
        },
    }, {
        tableName: 'orders',
        timestamps: false, // Disable default timestamps (createdAt, updatedAt)
    });

    return Order;
};
