const path = require('path')
const fs = require('fs-extra')
const abiDecoder = require('abi-decoder')
const Web3 = require("web3")
const EEAClient = require("web3-eea")

const config = require('./config')
const eventHandler = require('./eventHandler')

const chainId = 1337

// Add ABI contract
const contractPath = path.resolve(__dirname, 'contract', config.besu.contractABIFile)
const contractJSON = JSON.parse(fs.readFileSync(contractPath))
console.log(`Contract ABI file used: ${config.besu.contractABIFile}`)
abiDecoder.addABI(contractJSON.abi)

// Connect with node
console.log(`Connecting to node ${config.besu.node.wsUrl}`)
console.log(`ChainId = ${chainId}`)
const node = new EEAClient(new Web3(config.besu.node.wsUrl), chainId)

function initializeEventMonitor() {
    const filter = {
        // address: contract,
        fromBlock: '0x01'
    }

    console.log(`Installing filter ${JSON.stringify(filter)} with privacyGroupId ${config.besu.privacyGroupId}`)

    // Create subscription
    return node.priv.subscribe(config.besu.privacyGroupId, filter, (error, result) => {
        if (! error) {
            console.log("Installed filter", result)
            console.log(`Watching privacyGroupId ${config.besu.privacyGroupId}`)
        } else {
            console.error("Problem installing filter:", error)
            throw error
        }
    })
    .then(async subscription => {
        // Add handlers for incoming events
        subscription
            .on("data", async log => {
                if (log.result != null) { 
                    // Logs from subscription are nested in `result` key
                    console.log("LOG =>", log.result)

                    // Decode event
                    console.log("Decoding received log...")
                    const decodedLogs = abiDecoder.decodeLogs([ log.result ])
                    console.log(JSON.stringify(decodedLogs))

                    // Execute actions
                    try {
                        await eventHandler.manage(decodedLogs[0])

                        //TODO: enviar correo
                    } catch(error) {
                        console.log(error)
                    }
                } else {
                    console.log("LOG =>", log)
                }
            })
            .on("error", console.error)

        // Unsubscribe and disconnect on interrupt
        process
            .on("SIGINT", async () => {
                console.log("unsubscribing")
                await subscription.unsubscribe((error, success) => {
                    if (!error) {
                        console.log("Unsubscribed:", success)
                    } else {
                        console.error("Failed to unsubscribe:", error)
                    }
    
                    node.currentProvider.disconnect()
                })
            })
    })
}

module.exports = {
    initializeEventMonitor
}