const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_complete", "root", "03052002", {
  dialect: "mysql",
  host: "localhost",
  port: 8080,
});

module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_complete',
//     password: '03052002',
//     port: 8080
// });

// module.exports = pool.promise();
