var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  id: Number,
  age: Number,
  createdDate: { type: Date, default: Date.now }
})

const user = mongoose.model('user', userSchema);

router.get('/', function (req, res) {
  res.render('users');
});

router.post('/created', (req, res) => {
  user.find({}, (err, data) => {
    if (err) throw err;
    for (let i = 0; i < data.length; i++) {
      if (req.body.id == data[i].id) {
        req.body.id++;
        i--;
      }
    }
    const newUser = new user();
    newUser.email = req.body.email;
    newUser.name = req.body.name;
    newUser.id = req.body.id;
    newUser.age = req.body.age;
    newUser.save((err, data) => {
      if (err) throw err;
      console.log(`new user save ${data}`);
      res.render('created', {
        email: req.body.email,
        name: req.body.name,
        id: req.body.id,
        age: req.body.age
      });
    });
  })

});

router.get('/all', (req, res) => {
  user.find({}, (err, data) => {
    if (err) throw err;
    res.render('userList', { data: data });
  })
});

router.get('/edit/:id', (req, res) => {
  let userID = req.params.id;
  user.findOne({ id: userID }, (err, data) => {
    if (err) throw err;
    res.render('edit', {
      id: data.id,
      name: data.name,
      email: data.email,
      age: data.age
    });
  });
});

router.post('/editted', (req, res) => {
  user.findOneAndUpdate({ id: req.body.id }, { $set: { email: req.body.email, name: req.body.name, age: req.body.age } }, { new: true }, (err, data) => {
    if (err) throw err;
    console.log(`New data saved: ${data}`);
    res.render('created', {
      email: req.body.email,
      name: req.body.name,
      id: req.body.id,
      age: req.body.age
    });
  })
});

router.get('/delete/:id', (req, res) => {
  console.log(`Trying to delete ${req.params.id}`);
  user.findOneAndDelete({ id: req.params.id }, (err, data) => {
    if(err) throw err;
    res.render('delete');
  });
});

router.get('/search', (req, res) => {
  res.render('search');
})

router.post('/searched', (req, res) => {
  user.findOne({name: req.body.name}, (err, data) => {
    if(err) throw err;
    if(data) {
      res.render('searched.pug', {
        email: data.email,
        name: data.name,
        id: data.id,
        age: data.age
      })
    } else {
      res.render('notFound');
    }
  })
})

module.exports = router;