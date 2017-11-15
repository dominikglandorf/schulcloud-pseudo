// https://github.com/schul-cloud/node-lti-provider-example
// https://blog.schul-cloud.org/tutorial-lti-schnittstelle-integrieren-2/

const express = require('express'),
      app   = express(),
      axios = require('axios'),
      uuid  = require('uuid/v4'),
      jwt   = require("jsonwebtoken"),
      OAuth = require('oauth-1.0a'),
      config = require("./config"),
      crypto = require('crypto');

const { api, pseudonym } = config;

app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));

const a = fn => (...args) => fn(...args).catch(args[args.length - 1]);

app.get("/user", (req, res) => {
  res.status(200).send({
    user: pseudonym.find().map(({username, token}) => ({
      username, 
      token,
    })),
  });
});

app.post('/content', a(async (req, res) => {
  const { username } = req.body;
  
  if(!username) res.sendStatus(400);

  const result = pseudonym.findOne({username});

  const user = result !== null 
    ? result 
    : pseudonym.insert({
        username,
        token: uuid(),
      });

  const consumerKey = 'jisc.ac.uk'
  const consumerSecret = 'secret'

  const payload = {
    lti_version: 'LTI-1p0',
    lti_message_type: 'basic-lti-launch-request',
    resource_link_id: '77',
    user_id: user.token
  };

  const oAuthToken = OAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  //console.log(api)
  let request = {
    method: 'POST',
    url: api.defaults.baseURL,
    data: payload
  };

  const signed_params = oAuthToken.authorize(request);

  api.post("/", signed_params)
  .then(response => {
    res.status(200).send(response.data)
  }).catch(err => {
    console.log(err.message)
  })
}));

app.listen(8080, () => {
  console.log('Pseudo server listening on port 8080')
});