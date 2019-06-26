
exports.up = function(knex, Promise) {
  // make manufacturers table
  // make cars table

  return Promise.all([
    knex.schema.createTable('manufacturers', (table) => {
      table.increments('id').primary();
      table.string('manufacturer');

      table.timestamps(true, true);
    }),
    
    
  ])
};

exports.down = function(knex, Promise) {
  
};
