const config = require('./config')
const mail = require('./mail-sender')

const Web3 = require("web3")
const EEAClient = require("web3-eea")

// Connect with node
const node = new EEAClient(new Web3(config.besu.node.wsUrl), 1337)

let contracts = []

function addContract(contract) {
    if (contracts.indexOf(contract) == -1) {

        const filter = {
            address: contract,
            fromBlock: '0x01'
        }

        console.log(`Installing filter ${filter} with privacyGroupId ${config.besu.privacyGroupId}`)

        // Create subscription
        return node.priv.subscribe(config.besu.privacyGroupId, filter, (error, result) => {
            if (! error) {
                console.log("Installed filter", result)
                console.log(`Watching contract ${contract} with privacyGroupId ${config.besu.privacyGroupId}`)
            } else {
                console.error("Problem installing filter:", error)
                throw error
            }
        })
        .then(async subscription => {
            subscriptions.push(subscription)

            // Add handlers for incoming events
            subscription
                .on("data", log => {
                    if (log.result != null) {
                        // Logs from subscription are nested in `result` key
                        console.log("LOG =>", log.result);
                    } else {
                        console.log("LOG =>", log);
                    }
                })
                .on("error", console.error);

            // Unsubscribe and disconnect on interrupt
            process
                .on("SIGINT", async () => {
                    console.log("unsubscribing")
                    await subscription.unsubscribe((error, success) => {
                        if (!error) {
                            console.log("Unsubscribed:", success);
                        } else {
                            console.error("Failed to unsubscribe:", error);
                        }
        
                        node.currentProvider.disconnect()
                    })
                })
        })
    }
    else {
        console.log(`Contract ${contract} already watched!`)
        return false
    }
}

function watchEvent(event) {
    event.watch((error, event) => {
        if (error)
            console.log(error)
        else {
            console.log(`Received Event: ${JSON.stringify(event)}`)

            if (event.event === 'RegisterProductEvent') {
                console.log(`Received event of type ${event.event}. Contract=${event.address}. Provider email = ${hex2a(event.args.providerEmail)}. Reservation ID = ${hex2a(event.args.reservationId)}`)

                const providerEmail = hex2a(event.args.providerEmail)

                console.log(`LINK_DEST_VALIDATION: ${config.EMAIL.LINK_DEST_VALIDATION}`)

                //personalizar el link dependiendo del proveedor y la direccion del contrato
                let link = config.EMAIL.LINK_DEST_VALIDATION
                link = link.replace('<T3_APP>', config.providerMap[providerEmail] || config.providerMap['default'])
                link = link.replace('<CONTRACT>', event.address)
            
                // send email
                mail.sendEmail(
                    providerEmail,
                    'Nueva reserva pendiente de validar',
                    `Hola, tienes una nueva reserva pendiente. Para validarla pulsa en el siguiente enlace ${link}`,
                    `<p>Hola, <br><br>Tienes una nueva reserva pendiente. Para validarla pulsa en el siguiente <a href="${link}">enlace</a></p>`
                )
            }
            else if (event.event === 'ValidationDoneEvent') {
                console.log(`Received event of type ${event.event}. Contract=${event.address}. Customer email = ${event.args.customerEmail}. Reservation ID = ${event.args.reservationId}. Product ID = ${event.args.productId}`)

                const customerEmail = event.args.customerEmail

                //personalizar el link dependiendo del proveedor y la direccion del contrato
                let link = config.EMAIL.LINK_DEST_DETAIL
                link = link.replace('<T3_APP>', config.providerMap['default'])
                link = link.replace('<CONTRACT>', event.address)

                mail.sendEmail(
                    customerEmail,
                    'Su reserva ha sido validada por un proveedor',
                    `Hola, Nos complace informarte que tu reserva ${event.args.reservationId} ha sido validada por un proveedor. Puedes revisar el detalle de la reserva pulsando el siguiente enlace ${link}`,
                    `<p>Hola, <br><br>Nos complace informarte que tu reserva ${event.args.reservationId} ha sido validada por un proveedor. Puedes revisar el detalle de la reserva pulsando el siguiente <a href="${link}">enlace</a></p>`
                )
            }
            else {
                console.log(`Unknown event of type ${event.event}`)
            }
        }
    })
}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

module.exports = {
    addContract
}