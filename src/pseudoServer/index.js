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

app.post('/content', a(async (req, res) => {
  const { token } = req.body;
  
  if(!token) res.sendStatus(400);

  const user = pseudonym.insert({
    username,
    token: uuid(),
  });

  res.status(200).send((await api.get('/', { params: {
    token: user.token
  }})).data)
}));

app.listen(8080, () => {
  console.log('server listening on port 8080')
});