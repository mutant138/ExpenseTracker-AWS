const Sequelize = require('sequelize')

const sequelize = new Sequelize('expense', 'root', 'Dob@1380',{
    dialect: 'mysql',
    host: 'localhost',
    logging: false
})

module.exports = sequelize;