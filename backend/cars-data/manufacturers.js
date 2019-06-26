let cars = require('./cars.json');
let fs = require('fs');

const cleaned = cars.reduce((acc, car) => {
  acc[car.manufacturer] = null;
  return acc;
}, {});


const manufs = Object.keys(cleaned).reduce((acc, car) => {
  acc.push({ manufacturer: car })
  return acc;
}, []);

fs.writeFile('manufacturers.json', JSON.stringify(manufs), error => {throw error})