'use strict'

const eventListener = require('./event-listener')
const { logger } = require("./utils/logger");

logger.info('Initializing event monitor...')

try {
    eventListener.initializeEventMonitor() 
} catch(error) {
    logger.error('ERROR: Error al inicializar el monitor de eventos...')
    logger.error(error)
}