const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')
const login = require('../helper/jwt')

router.post('/signup', userController.createUsers)
router.post('/login', userController.userLogin)

router.get('/', login.isLogin, userController.findAllUsers)
router.post('/', login.isLogin, userController.createUsers)
router.get('/:id', login.isLogin, userController.findByIdUser)
router.put('/:id', login.isLogin, userController.updateUser)
router.delete('/:id', login.isLogin, userController.removeUsers)


module.exports = router;
