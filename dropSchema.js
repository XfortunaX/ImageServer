/**
 * Created by sergey on 22.07.17.
 */
const mongoose = require('mongoose');

mongoose.Promise = Promise; // Просим Mongoose использовать стандартные Промисы
mongoose.set('debug', true); // Просим Mongoose писать все запросы к базе в консоль
mongoose.connect('mongodb://localhost/testIm', { useMongoClient: true });
const db = mongoose.connection;
db.dropDatabase();

db.close();
