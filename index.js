const eventListener = require('./event-listener')

console.log('Initializing event monitor...')

try {
    eventListener.initializeEventMonitor() 
} catch(error) {
    console.log('ERROR: Error al inicializar el monitor de eventos...')
    console.log(error)
}