const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', '03052002', {
  dialect: 'mysql',
  host: 'localhost',
  port: 8080
});

module.exports = sequelize;
