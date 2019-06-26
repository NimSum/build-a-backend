
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
      table.strings('acceleration');
      table.strings('capacity');
      table.strings('charge_time');
      table.strings('range');
      table.strings('date_and_sales');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
