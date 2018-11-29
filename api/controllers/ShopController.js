/**
 * ShopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let SHA256 = require('crypto-js/sha256');
let MD5 = require('crypto-js/md5');
let request = require('request');
const uuidv1 = require('uuid/v1');

module.exports = {
  destroy: function(req, res) { return res.badRequest(); },
  remove: function(req, res) { return res.badRequest(); },
  replace: function(req, res) { return res.badRequest(); },
  add: function(req, res) { return res.badRequest(); },
  create: function(req, res) { return res.badRequest(); },
  
  items: async function (req, res) {
    let products = await Products.find();
    return res.view('pages/shop/main', {
      layout: '/layouts/page',
      title: 'Shop',
      shop: products
    });
  },

  item: async function (req, res) {
    let product = await Products.find({ slug: req.params.id });
    if ( product.length === 0 ) { return res.notFound(); }
    
    return res.view('pages/shop/item', {
      layout: '/layouts/page',
      title: 'Shop - ' + product[0].title,
      shop: product[0],
      checkout: getPayuData( product[0] )
    });
  },

  response: function (req, res) {
    if ( verifyResponseSignature( req.query ) ) {
      return res.view('pages/shop/response', {
        layout: '/layouts/page',
        title: 'Shop - Result',
        checkout: getResponseData( req.query )
      });
    } else {
      return res.serverError('Error validating digital signature of transaction.');
    }
  },

  confirmation: async function (req, res) {
    if ( verifyConfirmationSignature( req.query ) ) {
      let data = await saveToDatabase( req.query, req.params.id );
      sails.log('Order', data.order, 'created for user', data.user.id);

      sails.hooks.minecraft.activate( req.params.id, data.user.username );
      sails.log('Activating package', req.params.id, 'for user', data.user.username);

      return res.json( req.query );
    } else {
      return res.serverError('Error validating digital signature of transaction.');
    }
  }

};


function getPayuData( item ) {
  let payu = sails.config.payu;
  let reference = uuidv1();
  let signature = payu.apiKey + "~" + payu.merchantId + "~" + reference + "~" + item.price + "~" + payu.currency;
  signature = SHA256(signature);

  return {
    test: payu.test,
    merchantId: payu.merchantId,
    accountId: payu.accountId,
    amount: item.price,
    currency: payu.currency,
    referenceCode: reference,
    algorithmSignature: payu.algorithmSignature,
    description: 'DDR Server - ' + item.title,
    signature: signature.toString(),
    responseUrl: 'https://ddrserver.com' + item.response,
    confirmationUrl: 'https://ddrserver.com' + item.confirmation + item.slug
  };
}

function round(n) { return parseFloat(n).toFixed(1); }

function verifyResponseSignature( query ) {
  let payu = sails.config.payu;
  
  let signature = payu.apiKey + "~" + query.merchantId + "~" + query.referenceCode + "~" + round( query.TX_VALUE ) + "~" + query.currency + "~" + query.transactionState;
  signature = MD5(signature);

  return query.signature == signature.toString() ? true : false;
}

function getResponseData( query ) {
  return {
    transactionState: query.transactionState,
    transactionId: query.transactionId,
    reference_pol: query.reference_pol,
    referenceCode: query.referenceCode,
    pseBank: query.pseBank,
    cus: query.cus,
    value: query.TX_VALUE,
    currency: query.currency,
    username: query.extra1,
    lapPaymentMethod: query.lapPaymentMethod
  }
}

function roundConfirmation(n) {
  return n.split('.')[1] == '00' ? round(n) : n;
}

function verifyConfirmationSignature( query ) {
  let payu = sails.config.payu;

  let signature = payu.apiKey + "~" + query.merchant_id + "~" + query.reference_sale + "~" + roundConfirmation( query.value ) + "~" + query.currency + "~" + query.state_pol;
  signature = MD5(signature);

  return query.signature == signature.toString() ? true : false;
}

async function saveToDatabase( data, slug ) {
  let product = await Products.findOne({ slug: slug });

  let user = await Users.findOrCreate(
    { username: data.extra1 },
    {
      username: data.extra1,
      email: data.email_buyer
    }
  );

  let order = await Orders.create({
    user: user.id,
    product: product.id,
    date: data.transaction_date,
    state: data.state_pol,
    referenceCode: data.reference_sale,
    referencePol: data.reference_pol,
    transactionId: data.transaction_id,
    cus: data.cus,
    signature: data.signature,
    paymenthMethod: data.payment_method,
    paymenthMethodType: data.payment_method_type,
    value: data.value,
    taxes: data.tax
  }).fetch();

  return { order: order.id, user: { id: user.id, username: user.username } };
}

async function getMcUUID( username ) {
  return await request.get('https://api.mojang.com/users/profiles/minecraft/' + username, function(err, res, body) {
    return err ? err : body.id;
  });
}
