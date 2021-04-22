'use strict'

const path = require('path')
const fs = require('fs-extra')
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const EEAClient = require('web3-eea')

const config = require('./config')
const mail = require('./mail-sender')
const { logger } = require("./utils/logger")

const chainId = 1337
const web3 = new EEAClient(new Web3(config.besu.node.url), chainId)

// Add ABI contract
const insuranceContractPath = path.resolve(__dirname, 'contract', 'Insurance.json')
const InsuranceContractJSON = JSON.parse(fs.readFileSync(insuranceContractPath))

/**
 * Obtiene el abi (datos de una función en solidity) de la función elegida
 * @param {Object} abi
 * @param {String} functionName
 * @param {Web3} web3
 * @returns {Object} Abi de la función elegida
 */
function getFunctionAbi(abi, functionName) {
    const contract = new web3.eth.Contract(abi)
    const functionAbi = contract._jsonInterface.find((e) => {
        return e.name === functionName;
    })
    return functionAbi
}

/**
 * Actualiza la PCR del contrato de póliza
 */
function updatePCR(insuranceContractAddress, idPCR, resultPCR) {
    return new Promise(async function (resolve, reject) {
        try {
            let funcAbi = await getFunctionAbi(InsuranceContractJSON.abi, 'updatePCR')
            logger.debug(funcAbi)

            // Encode arguments
            let funcArguments = web3.eth.abi
            .encodeParameters(funcAbi.inputs, [
                Web3Utils.fromAscii(idPCR),
                Web3Utils.fromAscii(resultPCR)
            ])
            .slice(2)

    
            let functionParams = {
                to: insuranceContractAddress,
                data: funcAbi.signature + funcArguments,
                privateFrom: config.orion.taker.publicKey,
                privateFor: [config.orion.insurer.publicKey],
                privateKey: config.besu.node.privateKey,
            }

            logger.info(`Launching updatePCR transaction to insurance contract...`)
            let transactionHash = await web3.eea.sendRawTransaction(functionParams)
            logger.debug(`Transaction hash: ${transactionHash}`)
            let result = await web3.priv.getTransactionReceipt(
                transactionHash,
                config.orion.taker.publicKey
            )
            logger.info(`updatePCR transaction executed`)

            logger.debug(result)

            if (result.revertReason) {
                logger.error(
                    Web3Utils.toAscii(result.revertReason),
                    '//////////////////////////////////////////'
                )
                reject(Web3Utils.toAscii(result.revertReason))
            }
            resolve(result)
        } catch(error) {
            reject(error)
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

/**
 * Envio de correos a la aseguradora con los datos del pago a realizar
 */
function sendEmailToInsurer(takerId, insuranceId) {
    let link = "" //TODO: poner enlace a consulta de póliza de aplicación web

    // send email
    mail.sendEmail(
        config.EMAIL.insurerEmail,
        'SPC19: Indemnización calculada por la blockchain',
        `Hola,\nSe ha recibido un evento de la blockchain indicando que procede un pago con los siguientes datos.\n   - Identificador de la póliza: ${insuranceId}\n   - Identitifador del hotel: ${takerId}\nPuede acceder a los datos de la póliza usando el siguiente enlace: ${link}`,
        `<p>Hola, <br><br>Se ha recibido un evento de la blockchain indicando que procede un pago con los siguientes datos:</p><p><ul><li>Identificador de la p&oacute;liza: ${insuranceId}</li><li>Identitifador del hotel: ${takerId}</li></ul></p><p>Puede acceder a los datos de la p&oacute;liza usando el siguiente enlace: ${link}</p>`
    )
}

async function manage(log) {
    logger.info(`Event detected: ${log.name}`)
    switch (log.name) {
        case 'pcrUpdate':
            logger.info('Updating PCR in Insurance...')

            let insuranceContractAddress = log.events.find(e => e.name === 'insuranceAddress').value
            let idPCR = hex2a(log.events.find(e => e.name === 'pcrId').value)
            let idResult = hex2a(log.events.find(e => e.name === 'result').value)

            logger.info(`Event insuranceContractAddress: ${insuranceContractAddress}`)
            logger.info(`Event idPCR: ${idPCR}`)
            logger.info(`Event idResult: ${idResult}`)

            await updatePCR(insuranceContractAddress, idPCR, idResult)

            break;
        case 'checkPayment':
            logger.info('Sending email to insurer...')

            let takerId = hex2a(log.events.find(e => e.name === 'takerId').value)
            let insuranceId = hex2a(log.events.find(e => e.name === 'insuranceId').value)

            sendEmailToInsurer(takerId, insuranceId)
            logger.info('Email sended to insurer')
            break;
        default:
            logger.warn("WARNING: Event log not recognized!")
      }
}

module.exports = {
    manage
} 