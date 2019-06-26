// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/electric_cars',
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }

};
