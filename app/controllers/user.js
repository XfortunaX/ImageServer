/**
 * Created by sergey on 22.07.17.
 */
const mongoose  = require('mongoose');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true); // Просим Mongoose писать все запросы к базе в консоль
mongoose.connect('mongodb://localhost/testIm', { useMongoClient: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('open');
});

const user = require('../models/user');

module.exports = user;
