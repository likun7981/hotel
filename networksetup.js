const execa = require('execa')

execa.shell('networksetup -setautoproxyurl Wi-Fi local:2222')
