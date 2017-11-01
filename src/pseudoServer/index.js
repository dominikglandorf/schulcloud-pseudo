const express = require('express'),
      app = express(),
      axios = require('axios'),
      uuid = require('uuid/v4');

const tokens = {}
const users = {}

const api = axios.create({
  baseURL: 'http://127.0.0.1:8081',
});

app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(__dirname));

app.post('/content', (req, res) => {
  const { username:user } = req.body;
  console.log(user)

  let token
  if (!(user in tokens)) {
    token = uuid()
    tokens[user] = token
    users[token] = user
  } else {
    token = tokens[user]
  }

  api.get('/', {
    params: {
      token
    }
  }).then(result => {
    res.status(200).send(result.data)
  }).catch(err => {
    console.log(err)
  })
});

app.listen(8080, () => {
  console.log('server listening on port 8080')
});