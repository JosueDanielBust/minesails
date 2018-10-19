/**
 * Minecraft hook
 *
 * @description :: Hook that lifts Minecraft server
 */

module.exports = function (sails) {

  let hook;

  const ScriptServer = require('scriptserver');
  const server = new ScriptServer({
    core: {
      jar: 'spigot.jar',
      args: ['-Xmx2G'],
      rcon: {
        port: '25575',
        password: 'password'
      }
    }
  });

  return {

    /**
     * Lifting Minecraft Server and RCON communication after Sails app lifts.
     *
     * @param {Function} done
     */
    initialize: function (done) {
      sails.log.info('Initializing: (MSH) Minecraft Server Hook');

      hook = this;
      hook.server = server.start();

      return done();
    },
    routes: {
      after: {
        'GET /shop/vip/*': function (req, res, next) {
          let data = { secret: req.secret, params: req.params };
          //hook.server.send(`op ${data.params[0]}`);
          hook.server.send(`say it\'s OP now :O!`);
          return next();
        }
      }
    }
  };
};
