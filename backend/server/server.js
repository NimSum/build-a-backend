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

app.get('/api/v1/cars', (req, res) => {
  database('cars')
    .select()
    .then(cars => res.status(200).json(cars))
    .catch(error => res.status(500).json({ error }))
})

app.get('/api/v1/cars/:id', (req, res) => {
  database('cars')
    .select()
    .then(cars => {
      const id = parseInt(req.params.id);
      const found = cars.find(car => car.id === id);
      res.status(200).json(found);
    })
    .catch(error => res.status(500).json({ error }))
})

app.post('/api/v1/manufacturers', (req, res) => {
  const newManufacturer = req.body.manufacturer;
  if (!newManufacturer) {
    return res.status(422).send({
      error: 'Manufacturer name is required'
    });
  }
  console.log(newManufacturer);
  database('manufacturers')
    .insert({ manufacturer: newManufacturer }, 'id')
    .then(manufacturer => res.status(201).json(manufacturer))
    .catch(error => res.status(500).json({ error }))
})


