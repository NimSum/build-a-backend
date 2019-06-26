let cars = require('./cars.json');
let manufs = require('./manufacturers.json');
let fs = require('fs');



// Map through to connect id to manufacturer
// const manufss = cars.map(car => {
//   car.manuf_id += 120;
//   // const found = manufs.find(man => man.manufacturer === car.manufacturerId);
//   // const index = manufs.indexOf(found);
//   // car.manufacturerId = index + 1;
//   return car;
// })

// Create manuf obj array
// const cleaned = cars.reduce((acc, car) => {
//   acc[car.manufacturer] = null;
//   return acc;
// }, {});


// const manufs = Object.keys(cleaned).reduce((acc, car) => {
//   acc.push({ manufacturer: car })
//   return acc;
// }, []);

const manufss = manufs.map((man, idx) => {
  man.manuf_id = man.manuf_id - 120;
  return man;
})

fs.writeFile('cars.json', JSON.stringify(manufss), error => {throw error})