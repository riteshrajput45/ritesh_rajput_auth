const { Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users'; // migration me jo table banaya tha
  }
}

module.exports = User;
