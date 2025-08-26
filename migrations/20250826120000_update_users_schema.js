exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('first_name');
    table.string('last_name');
  }).then(function(){
    return knex.schema.alterTable('users', function(table){
      table.renameColumn('rest_token', 'reset_token');
      table.renameColumn('rest_token_expires', 'reset_token_expires');
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropColumn('first_name');
    table.dropColumn('last_name');
  }).then(function(){
    return knex.schema.alterTable('users', function(table){
      table.renameColumn('reset_token', 'rest_token');
      table.renameColumn('reset_token_expires', 'rest_token_expires');
    });
  });
};
