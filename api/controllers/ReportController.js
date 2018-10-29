/**
 * ReportController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  destroy: function(req, res) { return res.badRequest(); },
  remove: function(req, res) { return res.badRequest(); },
  replace: function(req, res) { return res.badRequest(); },
  add: function(req, res) { return res.badRequest(); },
  
  create: async function (req, res) {
    req.file('screenshots').upload({
      maxBytes: 10000000,
      dirname: require('path').resolve(sails.config.appPath, 'assets/images/screenshots/')
    }, async function (err, uploadedFiles) {
      if (err) return res.serverError(err);
      if (uploadedFiles.length === 0){ return res.badRequest('No file was uploaded'); }
      
      let data = req.allParams(), images = [];
      uploadedFiles.forEach(e => { images.push({ file: e.fd, status: e.status }); });
      data.images = images;

      await Report.create( data ).fetch();
      sails.log.info('New report created for ' + data.username + ' with (' + uploadedFiles.length + ') uploaded files.');
      
      EmailService.emailReport(data);
      
      return res.redirect('/report/thanks/');
    });
  },

};