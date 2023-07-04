const mongoose  = require("mongoose");


const appointment = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
    cpf: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean
});

const Appo = mongoose.model("Appointment", appointment)

module.exports = Appo;