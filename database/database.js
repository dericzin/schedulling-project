const mongoose = require("mongoose");

const mongoDBConnection = "mongodb+srv://admin:admin@schedullingapi.tjayz6f.mongodb.net/"


const connectToMongoDB = () => {
    return mongoose.connect(mongoDBConnection, { useNewUrlParser: true, useUnifiedTopology: true });
};


module.exports = connectToMongoDB
