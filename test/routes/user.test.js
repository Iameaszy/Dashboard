const request = require('supertest');
const mongoose = require('mongoose');
const {
  expect,
} = require('chai');
const server = require('../../app');


const UserModel = mongoose.model('Users');

after((done) => {
  server.close();
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  mongoose.disconnect();
  done();
});
beforeEach((done) => {
  setTimeout(() => done(), 500);
});


describe('/user/signup', () => {
  before((done) => {
    UserModel.deleteMany({}, (err) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  it('should reply with 200 status code', (done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
        name: 'Yusuf Adeniyi',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should reply with 400 status code', (done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
        name: 'Yusuf Adeniyi',
      })
      .expect(400, done);
  });
});

describe('/user/signup with invalid data', () => {
  beforeEach((done) => {
    UserModel.deleteMany({})
      .then(() => {
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('should reply with invalid email error message', (done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick@gmail',
        password: '62337087',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('message')
          .to.equals('Invalid email');
        expect(res.status).to.equals(400);
        done();
      });
  });
  it('should reply with 400 status code', (done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .expect(400, done);
  });
  it('should reply with Missing credentials error message', (done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('message')
          .to.equals('Missing credentials');
        done();
      });
  });
  it("should reply with name field can't be empty ", (done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick10@gmail.com',
        password: '12345678',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('message')
          .to.equals('name field can\'t be empty');
        done();
      });
  });
});

describe('/user/login', () => {
  before((done) => {
    request(server)
      .post('/user/signup')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .then(() => done())
      .catch((err) => {
        done(err);
      });
  });

  after((done) => {
    UserModel.deleteMany({}, (err) => {
      if (err) {
        return done(err);
      }
      done();
    });
  });


  it('should reply with 200 status code', (done) => {
    request(server)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.status).to.equals(200);
        done();
      });
  });

  it('should have a response body with property token', (done) => {
    request(server)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('token')
          .to.be.a('string');
        done();
      });
  });
  it('should have a response status code of 200', (done) => {
    request(server)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcdefgh',
      })
      .expect(200, done);
  });
  it('should have a response status code of 400', (done) => {
    request(server)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick0@gmail.com',
        password: 'abcdefgh',
      })
      .expect(400, done);
  });

  it('should have an error response "Invalid password"', (done) => {
    request(server)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
        password: 'abcde',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('message')
          .to.equals('Incorrect email/password');
        done();
      });
  });
  it('should have an error response "Missing credentials"', (done) => {
    request(server)
      .post('/user/login')
      .type('form')
      .send({
        email: 'easyclick05@gmail.com',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res.body)
          .to.have.property('message')
          .to.equals('Missing credentials');
        done();
      });
  });
});
