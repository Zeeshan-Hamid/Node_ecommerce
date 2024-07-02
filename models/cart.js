const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Cart = sequelize.define('cart', {
  id: {
    primaryKey: true,
    allowNull: false,
    type: Sequelize.INTEGER,
    autoIncrement: true
  }
})

module.exports = Cart