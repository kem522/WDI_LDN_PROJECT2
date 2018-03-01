const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const picData = require('./data/picture-data');
const Picture = require('../models/picture');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/picture-app', (err, db) => {
  db.dropDatabase();

  Picture.create(picData)
    .then(pictures => console.log(`${pictures.length} pictures created`))
    .catch(err => console.log(err))
    .finally(() => mongoose.connection.close());
});
