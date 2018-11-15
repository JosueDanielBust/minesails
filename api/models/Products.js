/**
 * Products.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    slug: { type: 'string', required: true, columnType: 'varchar(50)' },
    title: { type: 'string', required: true, columnType: 'varchar(50)' },
    price: { type: 'number', required: true, columnType: 'float(10,2)' },
    content: { type: 'json', required: true },
    comments: { type: 'string', required: true, columnType: 'varchar(1000)' }
  },

};

