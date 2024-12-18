const mongoose = require('mongoose');

const connectionString = "mongodb+srv://s64brochard:xiwjfTyXB66jq0TN@cluster0.atnt1.mongodb.net/hackatweet"

// const connectionString = 'mongodb+srv://s64brochard:xiwjfTyXB66jq0TN@cluster0.atnt1.mongodb.net/orientexpress2';


mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error));
