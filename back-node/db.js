
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mydatabase', 'postgres', 'NoSabe89', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = sequelize;
