// Set environment to the current environment(deployed) or development
const environment = process.env.NODE_ENV || 'development';
// Set config to knex and attach the current environment
const configuration = require('../../knexfile')[environment];
// Create database based on the current configuration
const database = require('knex')(configuration);
// import express
const express = require('express');
// const geoLocator = require('geoip-lite');

// Create express app
const app = express();
// Set port to current env port or 300
const port = process.env.PORT || 3000;

// Set the posrt to the port variable
app.set('port', port);
// Listen to the current port and console log the current port when server is started
app.listen(port, () => {
  console.log(`App is running at ${port} 🧐`);
})
// For stringifying response data
app.use(express.json());


/// **** EXPERIMENTAL AREA CODE BLOCKING"
// app.all('*', (req, res, next) => {
//   // const location = geoLocator.lookup('207.189.30.171'); // Denver(TURING IP)
//   // const location = geoLocator.lookup('208.84.155.36'); // Dallas
//   const location = geoLocator.lookup(req.ip) // Server-side 
//   if (location.city === 'Denver' && location.region === 'CO') {
//     next();
//   } else res.status(403).json({ error: `This api is not available in ${ location.city }, it's only for Denver developers`});
// })


// Listen for get requests within this route
app.get('/api/v1/manufacturers', (req, res) => {
  // Select manufacturers from the database
  // After selection complete, respond with a status of 200, and include the manufacturers that was selected.
  // If database fails to select manufacturers, respond with status of 500 and the error
  database('manufacturers')
    .select()
    .then(manufacturers => res.status(200).json(manufacturers))
    .catch(error => res.status(500).json({ error }))
})

// Listen for get requests within this route, :id corresponds to a specific manufacturer id
app.get('/api/v1/manufacturers/:id', (req, res) => {
  // Select the manufacturer within the manufacturers database where the requested requested id matches 
  // After selection, check if the requested manufacturer exists
  // => If not, respond with a 404 status and the error message object
  // => If exists, respond with a status code of 200 and the manufacturer object that was found
  // If database fails to select manufacturer, respond with status of 500 and the error  
  database('manufacturers')
    .where({ id: req.params.id })
    .then(manuf => {
      if (!manuf || !manuf.length) res.status(404).json({ error: 'No manufacturer found' })
      else res.status(200).json(...manuf);
    })
    .catch(error => res.status(500).json({ error }));

})

// Listen for get requests within this route
app.get('/api/v1/cars', (req, res) => {
  // Select cars database
  // After selection complete, respond with a status of 200, and include the cars that was selected.
  // If database fails to select cars, respond with status of 500 and the error
  database('cars')
    .select()
    .then(cars => res.status(200).json(cars))
    .catch(error => res.status(500).json({ error }))
})

// Listen for get requests within this route, :id corresponds to a specific manufacturer id
app.get('/api/v1/cars/:id', (req, res) => {
  // Select the car within the cars database where the requested id matches 
  // After selection, check if the requested car exists
  // => If not, respond with a 404 status and the error message object
  // => If exists, respond with a status code of 200 and the car object that was found
  // If database fails to select car, respond with status of 500 and the error  
  database('cars')
  .where({ id: req.params.id })
  .then(car => {
    if (!car || !car.length) res.status(404).json({ error: 'No car found' })
    else res.status(200).json(...car);
  })
  .catch(error => res.status(500).json({ error }));
  
})

// Listen for post requests within this route
app.post('/api/v1/manufacturers', (req, res) => {
  // Get manufacturer prop from the request body
  const { manufacturer } = req.body;
  // Check if manufacturer was included within the body
  // => Respond with status code 422 if the required parameter is not included within the request
  if (!manufacturer) {
    return res.status(422).send({
      error: 'Manufacturer name is required'
    });
  }

  // Select the manufacturers database where the  new manufacturer matches any of the current manufacturers within the database
  // => If it already exists, respond with a status code of 409 and error message
  // => If exists, re-select the manufacturer database and insert the new manufacturer using insert method, first arg: new row(manufactuer), second arg is the new id for that row
  // After insertion, respond with a status code of 201 and include the new manufacturer id
  // Respond with status of 500 and the error object if insertion/checking of new manufacturer fails
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

// Listen for post requests within this route
app.post('/api/v1/cars', (req, res) => {
  // Assign request body to a vaariable
  const newCar = req.body;
  // Setup the required parameters array
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

  // Check if each the parameter is exists within request body
  // => If it not included, respond with status code 422 and the message that includes FIRST paramter that was not included
  for (let requiredParam of parameters) {
    if (!newCar[requiredParam] ) {
      res.status(422).json({ error: 
        `Expected parameters of ${parameters.join(', ')}. Missing: ${ requiredParam }`})
      return;
    }
  }

  // Select cars database where the model matches the new car that is requested to be posted
  // After selection, check if a car was selected, if so, respond with status code 409 and error message
  // If it is not in the database, respond with status 409 and error message
  // If it doesnt exist, re-select cars database and insert the new car
  // After insertion, respond with status 201 and the new car id
  // If insertion/checking of the new car fails, respond with status code 500 and error object
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

// Listen for delete requests within this route, :id corresponds to a specific manufacturer id requested to be deleted
app.delete('/api/v1/manufacturers/:id', (req, res) => {
  // Create id var from request params
  const { id } = req.params;

  // Select matching manufacturer using requested id within the manufacturers database
  // After selection, check if manufacturer to delete exists
  // => if not, respond with status 404 and error message
  // => if exists, select the manufacturer that is found and delete it, then respond with a status of 202
  // If checking/deleting of manufacturer fails, respond with status 500 and error object
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

// Listen for delete requests within this route, :id corresponds to a specific car id requested to be deleted
app.delete('/api/v1/cars/:id', (req, res) => {
  // Create id var from request params
  const { id } = req.params;

  // Select matching car using the request id within the cars database
  // After selection, check if car to delete exists
  // => if not, respond with status 404 and error message
  // => if exists, select the car that matches the requested id and delete it, then respond with a status of 202
  // If checking/deleting of car fails, respond with status 500 and error object
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

// Listen for post requests within this route, :id corresponds to a specific manufacturer id requested to be edited
app.put('/api/v1/manufacturers/:id', (req, res) => {
  // Create id var from request params
  const { id } = req.params;
  // Get updated props from request body
  const updated = req.body;

  // Select the manufacturer within the manufacturers database where the requested id matches 
  // If manufacturer doesn't exist, respond with 404 status and error message
  // If exists, re-select manufacturers database and find the matching id
  // Use update method and use the updated properties as the first arguement, the second argument is what the update method returns after editing
  // After editing, respond with status 202
  // When attempting to edit and the new property to be inserted does not match the schema, respond with status 404 and error
  // If manufacturer validation fails, respond with status 500 and message
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

// Listen for post requests within this route, :id corresponds to a specific car id requested to be edited
app.put('/api/v1/cars/:id', (req, res) => {
  // Create id var from request params
  const { id } = req.params;
  // Get updated props from request body
  const updated = req.body;

  // Select the car within the cars database where the requested id matches 
   // If car doesn't exist, respond with 404 status and error message
  // If exists, re-select cars database and find the matching id
  // Use update method and use the updated properties as the first arguement, the second argument is what the update method returns after editing
  // After editing, respond with status 202
  // When attempting to edit and the new property to be inserted does not match the schema, respond with status 404 and error
  // If car validation fails, respond with status 500 and message
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