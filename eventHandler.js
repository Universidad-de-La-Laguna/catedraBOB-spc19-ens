'use strict'

const path = require('path')
const fs = require('fs-extra')
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const EEAClient = require('web3-eea')

const config = require('./config')

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
            console.log(funcAbi)

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

            let transactionHash = await web3.eea.sendRawTransaction(functionParams)
            console.log(`Transaction hash: ${transactionHash}`)
            let result = await web3.priv.getTransactionReceipt(
                transactionHash,
                config.orion.taker.publicKey
            )

            console.log(result)

            if (result.revertReason) {
                console.log(
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

async function manage(log) {
    switch (log.name) {
        case 'pcrUpdate':
          console.log('Detectado evento pcrUpdate. Se actualiza la PCR en la póliza...')

          let insuranceContractAddress = log.events.find(e => e.name === 'insuranceAddress').value
          let idPCR = hex2a(log.events.find(e => e.name === 'pcrId').value)
          let idResult = hex2a(log.events.find(e => e.name === 'result').value)

          console.log(`Event insuranceContractAddress: ${insuranceContractAddress}`)
          console.log(`Event idPCR: ${idPCR}`)
          console.log(`Event idResult: ${idResult}`)

          await updatePCR(insuranceContractAddress, idPCR, idResult)

          break;
        default:
          console.log("WARNING: Event log not recognized!")
      }
}

module.exports = {
    manage,
} 