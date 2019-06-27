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
  database('manufacturers')
    .select()
    .then((manufs) => {
      if (manufs.some(manuf => manuf.manufacturer === newManufacturer)) {
        res.status(400).json({ error: 'Manufacturer already exists' })
      }
    })
  database('manufacturers')
    .insert({ manufacturer: newManufacturer }, 'id')
    .then(manufacturer => {
      res.status(201).json(manufacturer);
    })
    .catch(error => res.status(500).json({ error }))
})

app.post('/api/v1/cars', (req, res) => {
  const newCar = req.body;
  const format = [
    'manuf_id', 
    'model', 
    'top_speed', 
    'acceleration', 
    'capacity', 
    'charge_time', 
    'range', 
    'date_and_sales'
  ]

  for (let requiredParam of format) {
    if (!newCar[requiredParam] && newCar[requiredParam] !== "" ) {
      res.status(422).json({ error: 
        `Expected format of ${format.join(', ')}. Missing: ${ requiredParam }`})
    }
  }

  database('cars')
    .select()
    .then((cars) => {
      if (cars.some(car => car.model === newCar.model)) {
        res.status(404).json({ error: 'Car already exists' })
      }
    })

  database('cars').insert(newCar, 'id')
    .then(car => res.status(201).json(car))
    .catch(error => res.status(500).json({ error }))
})

app.delete('/api/v1/manufacturers/:id', (req, res) => {
  const id = parseInt(req.params.id);

  database('manufacturers')
    .select()
    .then( async (manufs) => {
      if (!manufs.some(manuf => manuf.id === id)) {
        res.status(404).json({ error: 'Manufacturer does not exist' }) 
      } else {
        await database('manufacturers')
          .where({ id: id.toString() })
          .del()
        res.status(202)
      };
    }).catch(error => {
      res.status(500).json({ error })
    })
})