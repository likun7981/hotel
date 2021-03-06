const express = require('express')
const conf = require('../../conf')
const log = require('../log')
const internalIp = require('internal-ip')

module.exports = function(group) {
  const router = express.Router()

  function pac(req, res) {
    log('Serve proxy.pac')
    if (conf.proxy) {
      res.render('proxy-pac-with-proxy', { conf })
    } else {
      internalIp
        .v4()
        .then(ip => {
          conf.host = ip
          res.render('proxy-pac', { conf })
        })
        .catch(() => {
          res.render('proxy-pac', { conf })
        })
    }
  }

  router
    .get('/proxy.pac', pac)
    .get(
      '/:id',
      group.exists.bind(group),
      group.start.bind(group),
      group.redirect.bind(group)
    )

  return router
}
