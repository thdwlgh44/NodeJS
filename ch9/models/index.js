const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename) // index.js
fs.readdirSync(__dirname)
.filter(file => { // .model.js와 같이 숨김 파일은 걸러내기
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
})
.forEach((file) => {
  const model = require(path.join(__dirname, file))
  console.log(file, model.name);
  db[model.name] = model;
  model.initiate(sequelize);
  model.associate
});
Object.keys(db).forEach(modelName => {
  console.log(db, modelName);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
})

module.exports = db;