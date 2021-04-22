const path = require('path')
const fs = require('fs-extra')
const abiDecoder = require('abi-decoder')
const Web3 = require("web3")
const EEAClient = require("web3-eea")

const config = require('./config')
const eventHandler = require('./eventHandler')
const { logger } = require('./utils/logger')

const chainId = 1337

// Add ABI contract
const contractPath = path.resolve(__dirname, 'contract', config.besu.contractABIFile)
const contractJSON = JSON.parse(fs.readFileSync(contractPath))
logger.info(`Contract ABI file used: ${config.besu.contractABIFile}`)
abiDecoder.addABI(contractJSON.abi)

// Connect with node
logger.info(`Connecting to node ${config.besu.node.wsUrl}`)
logger.info(`ChainId = ${chainId}`)
const node = new EEAClient(new Web3(config.besu.node.wsUrl), chainId)

function initializeEventMonitor() {
    const filter = {
        // address: contract,
        fromBlock: '0x01'
    }

    logger.info(`Installing filter ${JSON.stringify(filter)} with privacyGroupId ${config.besu.privacyGroupId}`)

    // Create subscription
    return node.priv.subscribe(config.besu.privacyGroupId, filter, (error, result) => {
        if (! error) {
            logger.info("Installed filter", result)
            logger.info(`Watching privacyGroupId ${config.besu.privacyGroupId}`)
        } else {
            logger.error("Problem installing filter:", error)
            throw error
        }
    })
    .then(async subscription => {
        // Add handlers for incoming events
        subscription
            .on("data", async log => {
                if (log.result != null) { 
                    // Logs from subscription are nested in `result` key
                    logger.debug("LOG =>", log.result)

                    // Decode event
                    logger.info("Decoding received log...")
                    const decodedLogs = abiDecoder.decodeLogs([ log.result ])
                    logger.info(JSON.stringify(decodedLogs))

                    // Execute actions
                    try {
                        await eventHandler.manage(decodedLogs[0])
                    } catch(error) {
                        logger.error(error)
                    }
                } else {
                    logger.debug("LOG =>", log)
                }
            })
            .on("error", logger.error)

        // Unsubscribe and disconnect on interrupt
        process
            .on("SIGINT", async () => {
                logger.info("unsubscribing")
                await subscription.unsubscribe((error, success) => {
                    if (!error) {
                        logger.info("Unsubscribed:", success)
                    } else {
                        logger.error("Failed to unsubscribe:", error)
                    }
    
                    node.currentProvider.disconnect()
                })
            })
    })
}

module.exports = {
    initializeEventMonitor
}