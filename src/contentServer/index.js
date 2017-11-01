const express = require('express'),
  path = require("path"),
  app = express();

app.get("/", (req, res) => {
  console.log(req.query);
  res.send(`Content for user with token ${req.query.token}`);
});

app.listen(8081, () => {
  console.log('server listening on port 8081')
});