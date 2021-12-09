var express = require('express');
var router = express.Router();
var sgMail = require('@sendgrid/mail');

var sequelize = require('sequelize');
const Participants = require('../models').Participants;
const participants = require('../models/participants');

const API_key = 'Insert_API_Key_here';

sgMail.setApiKey(API_key);

var message = {
  from: 'yousef.essam02@gmail.com',
  subject: 'Signup Success Notification'
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

  let workshops = [req.body.workshop1, req.body.workshop2, req.body.workshop3, ...req.body.otherW.split('-')];

  let myData = {
    Name: req.body.name,
    University: req.body.university,
    Email: req.body.email,
    Gender: req.body.gender,
    Workshops: JSON.stringify(workshops)
  };

  console.log(myData);

  Participants.create(myData)
  .then(() => {
    console.log('Added Successfully');
    return Participants.findAll();
  }).then((records) => {
    console.log(records);
    res.render('success', {records: records});
  });
});

module.exports = router;
