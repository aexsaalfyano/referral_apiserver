require('dotenv').config();
const express = require('express');
const chalk = require('chalk');
const cors = require('cors');
const mongoose = require('mongoose');
// const passport = require('passport');

const keys = require('./config/keys');
const routes = require('./routes');

const { database, port } = keys;
const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));
app.use(cors());
// app.use(passport.initialize());

/* Public Static File */
app.use(express.static('public'));

// Connect to MongoDB
mongoose.set('useCreateIndex', true);
mongoose
  .connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() =>
    console.log(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`)
  )
  .catch(err => console.log(err));

// require('./config/passport');
app.use(routes);

app.listen(port, () => {
  console.log(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});

// const http = require('http');
// require('dotenv').config();
// const express = require('express');
// const chalk = require('chalk');
// const cors = require('cors');
// const mongoose = require('mongoose');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });