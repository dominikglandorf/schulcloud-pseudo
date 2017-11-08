// https://github.com/schul-cloud/node-lti-provider-example
// https://blog.schul-cloud.org/tutorial-lti-schnittstelle-integrieren-2/

const express = require('express'),
      app   = express(),
      axios = require('axios'),
      uuid  = require('uuid/v4'),
      jwt   = require("jsonwebtoken"),
      config = require("./config");

const { api, pseudonym } = config;

app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname));

const a = fn => (...args) => fn(...args).catch(args[args.length - 1]);

app.get("/token", (req, res) => {

});

app.post('/content', a(async (req, res) => {
  const { username } = req.body;
  
  if(!username) res.sendStatus(400);

  const user = pseudonym.insert({
    username,
    token: uuid(),
  });

  const oauth = OAuth({
    consumer: {
      key: key,
      secret: secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });

  res.status(200).send((await api.post('/', { params: {
    token: user.token
  }})).data)
}));

app.listen(8080, () => {
  console.log('server listening on port 8080')
});