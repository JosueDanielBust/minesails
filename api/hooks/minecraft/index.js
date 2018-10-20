/**
 * Minecraft hook
 *
 * @description :: Hook that lifts Minecraft server
 */

module.exports = function (sails) {

  let hook;

  const Rcon = require('modern-rcon');
  const rcon = new Rcon('localhost', 'password');

  return {

    /**
     * Lifting Minecraft Server and RCON communication after Sails app lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {
      sails.log.info('Initializing: (MSH) Minecraft Server Hook');

      hook = this;
      hook.rcon = rcon;

      return done();
    },
    routes: {
      after: {
        'GET /shop/vip/*': function (req, res, next) {
          let data = { secret: req.secret, params: req.params };
          //hook.server.send(`op ${data.params[0]}`);
          
          rcon.connect().then(() => {
            return rcon.send('help'); // That's a command for Minecraft
          }).then(res => {
            console.log(res);
          }).then(() => {
            return rcon.disconnect();
          });
          
          return next();
        }
      }
    }
  };
};
