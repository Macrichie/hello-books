const app = require('../../app');
const assert = require('chai');
const supertest = require('supertest');

//tests if admin can create book with correct information
//     describe('test if book can be created with correct and complete parameters', () => {
//      it('returns a new book', (done) => {
//      function makeText() {
//        var text = "";
//        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//        for (var i = 0; i < 5; i++)
//           text += possible.charAt(Math.floor(Math.random() * possible.length));
//           return text;
//      }
//      const book = {
//      title: makeText(),
//      description: makeText(),
//      quantity: '5',
//      image: "none for now",
//      category: makeText(),
//      publisher: "Test",
//      author: "Testing Test",
//      size: 250,
//      edition: 2010,
//      isbn: Math.random(),
//      token: adminToken
//      };
//      supertest(app).post('/api/books/create').send(book).end((err, res) => {
//      assert.equal(res.statusCode, 201);
//      assert.equal(res.body.message, 'Book Created Successfully.');
//      done();
//    });
//   });
//   });



 describe('In the Book controller, ', () => {
   const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJyb2xlIjoidXNlciIsImlhdCI6MTUwMjM2NjU0MywiZXhwIjoxNTAyNDUyOTQzfQ.JYEGFMoLgOUOV4aq1iE1m9C55478Boe8jyhXk3OnDIw';
   const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjozLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MDIzNjcyNDIsImV4cCI6MTUwMjQ1MzY0Mn0.nq01UVvZ2pSpQryoztJdqNOFTpl-U2wVuYaiaEKeeIc';
   //tests if user can get all books
   
   describe('test if user can get all books, ', () => {
       it('return all books', (done) => {      
         supertest(app).get('/api/books').set('x-access-token', token).send().end((err, res) => {
         assert.equal(res.statusCode, 200);
         done();
         });
       });
    });