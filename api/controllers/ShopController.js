/**
 * ShopController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  items: function (req, res) {

    const jsonfile = require('jsonfile');
    var file = './assets/json/data.json';
    jsonfile.readFile(file, function (err, obj) {
      if (err) {
        res.json({ err: err });
      }
      //console.dir(obj)
      res.json(obj);
    })
  },
  item: function (req, res) {

    const jsonfile = require('jsonfile');
    var file = './assets/json/data.json';
    jsonfile.readFile(file, function (err, obj) {
      if (err) {
        res.json({ err: err });
      }
      //console.dir(obj)
      console.log(req.params.id);
      res.json(obj[ req.params.id ]);
    })
  }

};

