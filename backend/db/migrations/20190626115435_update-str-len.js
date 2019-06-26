
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('cars', function(table) {
      table.string('date_and_sales', 1000).alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('cars', function(table) {
      table.string('date_and_sales').alter();
    })
  ]);
};
