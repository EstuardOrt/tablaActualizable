const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'my_friends', // Especifica el nombre de la tabla existente
    timestamps: false // Si tu tabla no tiene columnas createdAt y updatedAt
});

module.exports = User;
