const execa = require('execa')
const internalIp = require('internal-ip')
const { port, network, tld } = require('../conf')

const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'
const nw = network || 'Wi-Fi'

function macSetup(host) {
  execa
    .shell(
      `networksetup -setautoproxyurl ${nw} http://${host}:${port}/proxy.pac`
    )
    .then(() => {
      execa
        .shell(
          'networksetup -listallhardwareports | grep -A 1 Wi-Fi | tail -n 1 | cut -b 9-12'
        )
        .then(result => {
          const wifi = result.stdout
          try {
            execa.shellSync(`networksetup -setairportpower ${wifi} off`)
            execa.shellSync(`networksetup -setairportpower ${wifi} on`)
            console.log(`Config success!`)
            console.log(`You can use http://hotel.${tld} to access hotel`)
            console.log(`You can use http://xxx.${tld} to access your xxx app`)
          } catch (e) {
            throw e
          }
        })
        .catch(() => {
          console.log('Config success, but reload network failed！')
          console.log('Please reload network by hand')
          console.log(`You can use http://hotel.${tld} to access hotel`)
          console.log(`You can use http://xxx.${tld} to access your xxx app`)
        })
    })
    .catch(() => {
      console.log(`Config error!`)
    })
}

module.exports = function(host) {
  if (isMac) {
    if (!host) {
      return internalIp
        .v4()
        .then(macSetup)
        .catch(() => {
          macSetup('localhost')
        })
    }
    macSetup(host)
  } else if (isWin) {
    // TODO
  } else if (isLinux) {
    // TODO
  }
}
