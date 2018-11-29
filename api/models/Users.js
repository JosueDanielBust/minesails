/**
 * Users.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username: { type: 'string', required: true, unique: true, columnType: 'varchar(20)' },
    email: { type: 'string', required: true, columnType: 'varchar(50)' },
    uuid: { type: 'string', required: false, columnType: 'varchar(36)' },
  },

};

