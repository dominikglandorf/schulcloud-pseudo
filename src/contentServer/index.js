const express = require('express'),
  path = require("path"),
  app = express(),
  lti = require('ims-lti'),
  session = require('express-session');

const consumerSecret = 'secret';

app.post("/", (req, res) => {
  const consumerKey = req.body.oauth_consumer_key;
  if (typeof consumerKey === 'undefined' || consumerKey === null) {
    res.send('Must specify oauth_consumer_key in request.');
  }

  const provider = new lti.Provider(consumerKey, consumerSecret);

  provider.valid_request(req, (err, isValid) => {
    if(isValid) {
      res.send(`Content for user with token ${req.query.token}`);
    } else {
      res.send(err);
    }
  });
});

const port = 8081;
app.listen(port, function() {
  console.log(`listening on ${port}`);
});