exports.up = function(knex) {
    return knex.schema.alterTable('users', function(table) {
      table.dropColumn('name');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.alterTable('users', function(table) {
      table.string('name').notNullable();
    });
  };