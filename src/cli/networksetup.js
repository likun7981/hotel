const { shell, shellSync } = require('execa')
const internalIp = require('internal-ip')
const { port, tld } = require('../conf')

const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'
const isLinux = process.platform === 'linux'

function macSetup(host) {
  let nw = 'Wi-Fi'
  try {
    let { stdout: networkName } = shellSync(
      'networksetup -listnetworkserviceorder | grep -C 1 "Hardware Port: Wi-Fi" | head -n 1'
    )
    nw = networkName.replace(/^\(\d\)\s*(\S+)\s*$/, '$1')
  } catch (e) {
    // ignore
  }

  shell(`networksetup -setautoproxyurl ${nw} http://${host}:${port}/proxy.pac`)
    .then(() => {
      try {
        const { stdout: wifi } = shellSync(
          'networksetup -listallhardwareports | grep -A 1 Wi-Fi | tail -n 1 | cut -b 9-12'
        )
        shellSync(`networksetup -setairportpower ${wifi} off`)
        shellSync(`networksetup -setairportpower ${wifi} on`)
        console.log(`Config succeed!`)
        console.log(`http://${host}:${port}/proxy.pac`)
      } catch (e) {
        console.log('Config succeed, but reload network failed！')
        console.log(`http://${host}:${port}/proxy.pac`)
        console.log('Please reload network manually')
      }
      console.log(`You can use http://hotel.${tld} to access hotel`)
      console.log(`You can use http://xxx.${tld} to access your xxx app`)
    })
    .catch(() => {
      console.log(`Config failed!`)
    })
}

module.exports = function(host) {
  if (isMac) {
    if (!host) {
      macSetup('localhost')
    } else if (host === 'ip') {
      internalIp
        .v4()
        .then(macSetup)
        .catch(() => {
          console.log('Setup Local IP fail, use `localhost`')
          macSetup('localhost')
        })
    } else {
      macSetup(host)
    }
  } else {
    console.log('Not support now! please set up proxy configuration manually')
    if (isWin) {
      console.log('Settings > Network and Internet > Proxy > Use setup script')
      // TODO
    } else if (isLinux) {
      console.log('System Settings > Network > Network Proxy > Automatic')
      // TODO
    }
  }
}
