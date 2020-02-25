
exports.up = function(knex) {
  return knex.schema.createTable("user", t =>{
    t.increments()
    t.string("username")
    t.string("password_digest")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("user")
};
