export default (sequelize, DataTypes) => {
    const Messages = sequelize.define('Messages', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       
        messages: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true
        },
  
        
    }, {
        tableName: 'Messages'
    });

    return Messages;
}
