const mongoose = require('mongoose')
const schema = mongoose.Schema

const guestSchema = new schema()

const Guest = mongoose.model("Guest", guestSchema);

module.exports = Guest;