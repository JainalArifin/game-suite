const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  username: String,
  password: String
})

const user = mongoose.model('user', userSchema)

module.exports = user
