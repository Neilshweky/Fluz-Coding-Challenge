
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('users', function(table) {
      table.string('username').primary();
      table.string('password').notNull();
      table.integer('calorie_intake')
      table.integer('calorie_spend')

    })
    .createTable('friends', function(table) {
      table.string('from').notNull();
      table.string('to').notNull();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTable('users')
    .dropTable('friends'); 
};
