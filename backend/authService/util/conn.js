const mongoose = require('mongoose')
const URL = process.env.MONGO_URI
console.log('MONGO_URI:',URL)
mongoose.connect(URL)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB ERROR: '))

module.exports = {db, mongoose}