const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//bring in routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//init express in a variable
const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require('./config/keys').mongoURI;

//Connect to MONGODB through mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('mongo db connected'))
  .catch(err => console.log(err));

//simple route, takes in 2 variables: request and response
app.get('/', (req, res) => {
  res.send('Hello world');
});

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

//sets a port for node to use
const port = process.env.PORT || 5001;

//listen takes two variables, the port and a callback func
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
