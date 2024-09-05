export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,    
            primaryKey: true,   
            autoIncrement: true     
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cashBalance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            default:10000.00
        },
        startingBalance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            default:10000.00	
        },
        resetPasswordToken: {
            type: DataTypes.STRING,
            default: ""
        }
        
    }, {
        tableName: 'users',        
    });

    return User;
}