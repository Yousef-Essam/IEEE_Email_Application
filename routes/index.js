var express = require('express');
var router = express.Router();
var sgMail = require('@sendgrid/mail');
var session = require('express-session');
var crypto = require('crypto');

var sequelize = require('sequelize');
const Participants = require('../models').Participants;
const Sessions = require('../models').Sessions;

const API_key = 'Insert_API_Key_here';

sgMail.setApiKey(API_key);

var message = {
  from: 'yousef.essam02@gmail.com',
  subject: 'Signup Success Notification'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.cookies.sesID) checkSession(req.cookies.sesID).then((record) => {
    if (record[0]) {
      let existentSession = record[0].dataValues;
      console.log(req.cookies.sesID ? req.cookies.sesID : "Sad" + '\n');
      console.log(existentSession ? existentSession : "Sad");
      if (existentSession)
        Participants.findAll({
          where: {
            Name: existentSession.Name,
            Password: existentSession.Password
          }
        }).then((record) => {
            res.render('temp', {record: record[0]});
        });
      else
        res.render('index');
    }
  });
  else
        res.render('index');
});

router.get('/signin', function(req, res, next) {
  console.log(req.cookies.sesID ? req.cookies.sesID : "Sad");

  if (req.cookies.sesID)
    checkSession(req.cookies.sesID).then((record) => {
      if (record[0])
        res.redirect('/');

      else
        res.render('signin', {message: ""});
    })

  else
    res.render('signin', {message: ""});
});

router.post('/signin', function(req, res, next) {
  console.log(req.cookies.sesID ? req.cookies.sesID : "Sad");
  Participants.findAll({
    where: {
      Name: req.body.name,
      Password: req.body.password
    }
  }).then((record) => {
    if (record[0]) {
      let sesID = addSession(record[0]);

      res.cookie('sesID', sesID);
      res.redirect('/');
    } else 
      res.render('signin', {message: "Invalid Name or Password. Try Again."});
  }).catch((error) => {
    res.render('signin', {message: "Invalid Name or Password. Try Again."});
  });
  
});

router.post('/send', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  message.to = req.body.email;
  message.html = `<h1 style="text-align:center; border-bottom: 1px solid grey; color: red;">IEEE CUSB Signing Up Successful</h1>
  <h2>Thanks, ${req.body.name} for signing up to our services</h2>
  <div>We are contacting ${req.body.university} to get assured of your work.</div>
  <p style="text-align: center">Stay tuned for our response. <3</p>`
  sgMail
  .send(message)
  .then(function (response) {
    console.log('Message Sent');
  }).catch(function (error) {
    console.log(error.message);
  });

  let workshops = req.body.workshops.split('-');

  let myData = {
    Name: req.body.name,
    Email: req.body.email,
    Password: req.body.password,
    University: req.body.university,
    Gender: req.body.gender,
    Workshops: JSON.stringify(workshops)
  };

  console.log(myData);

  Participants.create(myData)
  .then(() => {
    console.log('Added Successfully');
    res.render('success');
  });
});

router.get('/users/table', function(req, res, next) {
  Participants.findAll()
  .then((records) => {
    res.render('table', {records: records});
  });
});

router.get('/logout', function(req, res, next) {
  if (req.cookies.sesID) checkSession(req.cookies.sesID).then((record) => {
    if (record[0])
      destroySession(req.cookies.sesID).then(() => {
        res.clearCookie('sesID');
        res.redirect('/');
      });
  })
  
});

module.exports = router;

function generateSessionID() {
  return crypto.randomBytes(16).toString('base64');
}

function addSession(record) {
  'use strict';

  let sesID = generateSessionID()

  Sessions.create({
    sessionID: sesID,
    Name: record.Name,
    Password: record.Password
  }).then(() => {
    console.log('Session Added Successfully!!');
  });

  return sesID;
}

function checkSession(sesID) {
  'use strict';

  return Sessions.findAll({
    where: {
      sessionID: sesID
    }
  });
}

function destroySession(sesID) {
  'use strict';

  return Sessions.destroy({
    where: {
      sessionID: sesID
    }
  });
}
