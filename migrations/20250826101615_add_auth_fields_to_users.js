/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table("users",function(table){
    table.string('rest_token');
    table.timestamp('rest_token_expires')
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.table('users',function(table){
    table.dropColumn('rest_token');
    table.dropColumn('rest_token_expires');
   })
};
