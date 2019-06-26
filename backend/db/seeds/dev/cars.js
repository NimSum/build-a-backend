const cars = require('../cars-data/cars.json');
const manufacturers = require('../cars-data/manufacturers.json');

exports.seed = function(knex, Promise) {
  return knex('cars').del()
    .then(async () => {
      await knex('manufacturers').del();
      await knex.raw('TRUNCATE TABLE manufacturers RESTART IDENTITY CASCADE')
    })
    .then(() => {
      return Promise.all([
        knex('manufacturers')
        .insert(manufacturers)
        .then(() => {
          const carPromises = cars.map(car => {
            return knex('cars').insert(car)
          });

          return Promise.all(carPromises);
        })
      ])
      .then(() => console.log('Successfully seeded cars and manufacturers'))
      .catch(error => console.log(`Error seeding cars/manufacturers ${error}`))
    }).catch(error => console.log(`Error seeding data: ${error}`))
};
