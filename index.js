'use strict'

const config = require('./config')
const eventListener = require('./event-listener')

console.log('Initializing event monitor...')

if (typeof config.spc19ContractAddress === 'undefined') {
    console.log("ERROR: Environment variable SPC19CONTRACTADDRESS is mandatory.")
    process.exit(1)
}
else
    console.log(`Using SPC19CONTRACTADDRESS=${config.spc19ContractAddress}`)

try {
    eventListener.initializeEventMonitor() 
} catch(error) {
    console.log('ERROR: Error al inicializar el monitor de eventos...')
    console.log(error)
}