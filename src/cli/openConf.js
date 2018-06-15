const launchEditor = require('./launchEditor')
const { confFile } = require('../common')

module.exports = function() {
  launchEditor(confFile)
}
