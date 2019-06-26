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

app.get('/api/v1/manufacturers', (req, res) => {
  database('manufacturers')
    .select()
    .then(manufacturers => res.status(200).json(manufacturers))
    .catch(error => res.status(500).json({ error }))
})

app.get('/api/v1/manufacturers/:id', (req, res) => {
  database('manufacturers')
    .select()
    .then(manufacturers => {
      const id = parseInt(req.params.id);
      const found = manufacturers.find(company => company.id === id);
      res.status(200).json(found);
    })
    .catch(error => res.status(500).json({ error }))
})