'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const fileConfig = require(path.join(__dirname, '../config/config.json'))[env];
const config = {
  ...fileConfig,
  host: process.env.DB_HOST || fileConfig.host,
  port: Number(process.env.DB_PORT || fileConfig.port || 3306),
  database: process.env.DB_NAME || fileConfig.database,
  username: process.env.DB_USER || fileConfig.username,
  password: process.env.DB_PASSWORD ?? fileConfig.password
};
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port || 3306,
    dialect: config.dialect || 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false
  }
);

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.endsWith('.test.js')
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
