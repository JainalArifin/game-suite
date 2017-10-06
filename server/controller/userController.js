const Users = require('../models/user')
const ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const findAllUsers = (req, res) => {
  Users.find({})
  .populate('todo')
  .then((dataUser) => {
    res.send(dataUser)
  })
  .catch((err) => {
    res.send({
      msg: 'data error'
    })
  })
}

const createUsers = (req, res) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(`${req.body.password}`, salt);
  Users.create({
    username: req.body.username,
    password: hash
  })
  .then((dataUser) => {
    res.send({
      message: 'data berhasil di tambahkan',
      dataUser: dataUser
    })
  })
  .catch((err) => {
    res.send(err)
  })
}

const userLogin = (req, res) =>{
  Users.findOne({
    username: req.body.username
  })
  .then((dataUser) => {
    if(dataUser == null){
      res.send({
        msg: 'username not found'
      })
    }
    else {
      if( bcrypt.compareSync(req.body.password, dataUser.password)){
        var token = jwt.sign({
          id: dataUser.id,
          username: dataUser.username
        },process.env.SECRET)
        res.send({
          msg: 'login success',
          data:token
        })
      }else {
        res.send({
          msg: 'password tidak di kenali'
        })
      }
    }
  })
  .catch((err) => {
    res.send(err)
  })
}

const findByIdUser = (req, res) =>{
  Users.findById({
    _id: ObjectId(req.params.id)
  })
  .then((dataUser) => {
    res.send(dataUser)
  })
  .catch((err) => {
    res.send(err)
  })
}

const updateUser = (req, res) =>{
  Users.findOneAndUpdate({
    _id: ObjectId(req.params.id)
  },{
    username: req.body.username,
    password: req.body.password
  })
  .then((dataUser) => {
    res.send({
      msg: 'berhasil di update',
      dataUser: dataUser
    })
  })
  .catch((err) => {
    res.send(err)
  })
}

const removeUsers = (req, res) =>{
  Users.findByIdAndRemove({
    _id: ObjectId(req.params.id)
  })
  .then((dataUser) => {
    res.send({
      msg: 'user berhasil di hapus',
      dataUser: dataUser
    })
  })
}

module.exports = {
  findAllUsers,
  createUsers,
  userLogin,
  findByIdUser,
  updateUser,
  removeUsers
}
