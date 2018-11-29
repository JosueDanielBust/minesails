/**
 * Orders.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    product: { model: 'Products' },
    user: { model: 'Users' },
    date: { type: 'string', required: true, columnType: 'varchar(20)' },
    state: { type: 'number', required: true, columnType: 'integer'},
    referenceCode: { type: 'string', required: true, columnType: 'varchar(36)' },
    referencePol: { type: 'string', required: true, columnType: 'varchar(20)' },
    transactionId: { type: 'string', required: true, columnType: 'varchar(36)' },
    cus: { type: 'string', required: false, columnType: 'varchar(36)' },
    signature: { type: 'string', required: true, columnType: 'varchar(32)' },
    paymenthMethod: { type: 'string', required: true, columnType: 'varchar(20)' },
    paymenthMethodType: { type: 'string', required: true, columnType: 'varchar(20)' },
    value: { type: 'number', required: true, columnType: 'float(14,2)' },
    taxes: { type: 'number', required: true, columnType: 'float(14,2)' },
  },

};

