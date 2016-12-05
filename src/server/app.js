/* @flow */

const express = require('express');
const app = express();
const api = require('./api');

const server = app.listen(process.env.PORT || 3000, () => {
  console.info(`Listening on port ${server.address().port}`);
});

app.use('/', express.static('dist/'));

api.registerEndpoints(app);