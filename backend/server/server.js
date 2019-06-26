const environment = process.env.NODE_ENV || 'development';
const configuration = require('../db/knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`App is running at ${port} 🧐`);
})
