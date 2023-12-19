const Sequelize = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

const sequelize = new Sequelize('expense', 'root', process.env.DB_PASS,{
    dialect: 'mysql',
    host: 'localhost',
    logging: false
})

module.exports = sequelize;