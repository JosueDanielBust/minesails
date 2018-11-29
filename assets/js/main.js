io.sails.url = 'http://localhost:1337/';
var v_shop = new Vue({
  el: '#shop',
  data: function () {
    return {
      shop: window.SAILS_LOCALS.shop,
      checkout: window.SAILS_LOCALS.checkout
    };
  }
});
var v_checkout = new Vue({
  el: '#checkout',
  data: function () {
    return {
      checkout: window.SAILS_LOCALS.checkout
    };
  }
});