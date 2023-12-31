const mongoose = require("mongoose");

const mongoDBConnection = "YourMongoDBConnection"


const connectToMongoDB = () => {
    return mongoose.connect(mongoDBConnection, { useNewUrlParser: true, useUnifiedTopology: true });
};


module.exports = connectToMongoDB
