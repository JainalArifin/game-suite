const chai = require('chai')
const should = chai.should()
const chaiHttp = require('chai-http')
const app = require('../app.js')
chai.use(chaiHttp)

var user = {
  username: 'jainal',
  password: '1'
}

describe('Register untuk mengetes', function(){
  it('mengetes apakah user id berhasil di buat', function(done){
    chai.request(app)
    .post('/users/signup')
    .send(user)
    .end(function(err, response){
      console.log('------>', response.body);
      response.status.should.equal(200)
      response.body.should.be.an('Object')
      response.body.dataUser.should.have.property('_id')
      response.body.dataUser.should.have.property('username')
      response.body.dataUser.should.have.property('password')
      done()
    })
  })
})


describe('login untuk mengetes', function(){
  it('mengetes apakah login id berhasil', function(done){
    chai.request(app)
    .post('/users/login')
    .send(user)
    .end(function(err, response){
      // console.log('------>', response);
      response.status.should.equal(200)
      response.body.should.be.an('Object')
      done()
    })
  })
})
