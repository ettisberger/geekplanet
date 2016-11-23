const express = require('express');
const app = express();

app.use('/', express.static('dist/'));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
  console.log(`Database URI is: ${process.env.MONGODB_URI}`);
});

require('./database/db');
