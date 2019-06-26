
exports.up = function(knex, Promise) {
  // make manufacturers table
  // make cars table

  return Promise.all([
    knex.schema.createTable('manufacturers', (table) => {
      table.increments('id').primary();
      table.string('manufacturer');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('cars', (table) => {
      table.increments('id').primary();
      table.integer('manuf_id').unsigned();
      table.foreign('manuf_id').references('manufacturers.id');
      table.string('model');
      table.string('top_speed');
      table.string('acceleration');
      table.string('capacity');
      table.string('charge_time');
      table.string('range');
      table.string('date_and_sales');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('manufacturers'),
    knex.schema.dropTable('cars')
  ])
};
