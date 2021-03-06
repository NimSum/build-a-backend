const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const express = require('express');
const geoLocator = require('geoip-lite');

const app = express();
const port = process.env.PORT || 3000;

app.set('port', port);
app.listen(port, () => {
  console.log(`App is running at ${port} 🧐`);
})
app.use(express.json());


app.all('*', (req, res, next) => {
  // const location = geoLocator.lookup('207.189.30.171'); // Denver(TURING IP)
  // const location = geoLocator.lookup('208.84.155.36'); // Dallas
  const location = geoLocator.lookup(req.ip) // Server-side 
  if (!location) {
    next();
    return;
  };
  if (location.city === 'Denver' && location.region === 'CO') {
    next();
  } else res.status(403).json({ error: `This api is not available in ${ location.city }, it's only for Denver developers`});
})


app.get('/api/v1/manufacturers', (req, res) => {
  database('manufacturers')
    .select()
    .then(manufacturers => res.status(200).json(manufacturers))
    .catch(error => res.status(500).json({ error }))
})

app.get('/api/v1/manufacturers/:id', (req, res) => {
  database('manufacturers')
    .where({ id: req.params.id })
    .then(manuf => {
      if (!manuf || !manuf.length) res.status(404).json({ error: 'No manufacturer found' })
      else res.status(200).json(...manuf);
    })
    .catch(error => res.status(500).json({ error }));

})

app.get('/api/v1/cars', (req, res) => {
  database('cars')
    .select()
    .then(cars => res.status(200).json(cars))
    .catch(error => res.status(500).json({ error }))
})

app.get('/api/v1/cars/:id', (req, res) => {
  database('cars')
  .where({ id: req.params.id })
  .then(car => {
    if (!car || !car.length) res.status(404).json({ error: 'No car found' })
    else res.status(200).json(...car);
  })
  .catch(error => res.status(500).json({ error }));
  
})

app.post('/api/v1/manufacturers', (req, res) => {
  const { manufacturer } = req.body;
  if (!manufacturer) {
    return res.status(422).send({
      error: 'Manufacturer name is required'
    });
  }

  database('manufacturers')
  .where({ manufacturer })
  .then(manuf => {
    if (!!manuf[0]) {
      res.status(409).json({ error: 'Manufacturer already exists' })
    } else {
      database('manufacturers').insert({ manufacturer }, 'id')
      .then(manufId => res.status(201).json(manufId))
      .catch(error => res.status(500).json({ error }))
    }
  }).catch(error => res.status(500).json({ error }));
})

app.post('/api/v1/cars', (req, res) => {
  const newCar = req.body;
  const parameters = [
    'manuf_id', 
    'model', 
    'top_speed', 
    'acceleration', 
    'capacity', 
    'charge_time', 
    'range', 
    'date_and_sales'
  ]

  for (let requiredParam of parameters) {
    if (!newCar[requiredParam] ) {
      res.status(422).json({ error: 
        `Expected parameters of ${parameters.join(', ')}. Missing: ${ requiredParam }`})
      return;
    }
  }

  database('cars')
    .where({ model: newCar.model })
    .then(car => {
      if (!!car[0]) {
        res.status(409).json({ error: 'Car already exists' })
      } else {
        database('cars').insert(newCar, 'id')
        .then(car => res.status(201).json(car))
        .catch(error => res.status(500).json({ error }))
      }
    }).catch(error => res.status(500).json({ error }));

})

app.delete('/api/v1/manufacturers/:id', (req, res) => {
  const { id } = req.params;

  database('manufacturers')
    .where({ id })
    .then( manuf => {
      if (!manuf[0]) {
        res.status(404).json({ error: 'Manufacturer does not exist' }) 
      } else {
        database('manufacturers')
        .where({ id })
        .del()
        .then(() => res.status(202))
      };
    }).catch(error => res.status(500).json({ error }));
})

app.delete('/api/v1/cars/:id', (req, res) => {
  const { id } = req.params;

  database('cars')
    .where({ id })
    .then(car => {
      if (!car[0]) {
        res.status(404).json({ error: 'Car does not exist' }) 
      } else {
        database('cars')
        .where({ id })
        .del().then(() => res.status(202))
      };
    }).catch(error => res.status(500).json({ error }));
})

app.put('/api/v1/manufacturers/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  database('manufacturers')
  .where({ id })
  .then(manuf => {
    if (!manuf || !manuf.length) {
      res.status(404).json({ error: 'No manufacturer found' })
    } else {
      database('manufacturers')
      .where({ id })
      .update({ ...updated }, ['id'])
      .then(() => res.status(202))
      .catch(() => res.status(404).json({ error: 'Property does not exist' }))
    };
  }).catch(error => res.status(500).json({ error }));
  
})

app.put('/api/v1/cars/:id', (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  database('cars')
  .where({ id })
  .then(car => {
    if (!car || !car.length) {
      res.status(404).json({ error: 'No car found' })
    } else {
      database('cars')
      .where({ id })
      .update({ ...updated }, ['id'])
      .then(() => res.status(202))
      .catch(() => res.status(404).json({ error: 'Property does not exist' }))
    };
  }).catch(error => res.status(500).json({ error }));

})