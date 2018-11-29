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

    /**
     * Activate package after signature validation
     * 
     * @param {Function} username
     */
    activate: function ( slug, username ) {
      switch (slug) {
        case 'vip': vip(username); break;
        case 'unban': unban(username); break;
        case 'vipunban': vip(username); unban(username); break;
        default: break;
      }
    },

    list: function () { list(); },

    routes: {
      after: {
        'GET /shop/activate/vip/*': function (req, res, next) {
          let data = { secret: req.secret, user: req.params[0], params: req.params };
          vip(data);
          return next();
        },
        'GET /shop/activate/unban/*': function (req, res, next) {
          let data = { secret: req.secret, params: req.params };
          unban(data);
          return next();
        },
        'GET /shop/activate/vipunban/*': function (req, res, next) {
          let data = { secret: req.secret, params: req.params };
          vip(data);
          unban(data);
          return next();
        }
      }
    }
  };
  function vip(data) {
    rcon.connect().then(() => {
      return rcon.send(`lp user ${data.user} parent addtemp vip 30d`);
    }).then(() => {
      return rcon.send(`eco give ${data.user} 500000`);
    }).then(() => {
      return rcon.send(`give ${data.user} minecraft:experience_bottle 64`);
    }).then(() => {
      return rcon.send(`give ${data.user} minecraft:diamond 64`);
    }).then(() => {
      return rcon.send(`tellraw ${data.user} ["",{"text":"[","color":"white","bold":true},{"text":"DDR Server","color":"aqua","bold":false},{"text":"] ","color":"white","bold":true},{"text":"Tu ","color":"white","bold":false},{"text":"VIP","color":"yellow","bold":true},{"text":" se ha activado exitosamente. ¡Gracias por apoyarnos!","color":"none","bold":false}]`);
    }).then(() => {
      return rcon.disconnect();
    });
  }
  function unban(data) {
    rcon.connect().then(() => {
      return rcon.send(`unban ${data.user}`);
    }).then(() => {
      return rcon.send(`unbanip ${data.user}`);
    }).then(() => {
      return rcon.disconnect();
    });
  }
  function list() {
    rcon.connect().then(() => {
      return rcon.send('list');
    }).then(res => {
      console.log(res);
    }).then(() => {
      return rcon.disconnect();
    });
  }
};
