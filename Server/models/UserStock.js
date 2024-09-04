export default (sequelize, DataTypes) => {
    const UserStock = sequelize.define("UserStock", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        accountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stock: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priceBought: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    }, {
        tableName: 'userstocks',
        timestamps: false, // Disable default timestamps (createdAt, updatedAt)
    });

    return UserStock;
};
