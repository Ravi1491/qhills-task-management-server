require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASENAME,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASENAME,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASENAME,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
  },
};
