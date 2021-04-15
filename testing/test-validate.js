var Web3 = require('web3')
const config = require('./config')
const reservationContractData = require('./reservationContractData')

const provider = 'provider2'

// conexion a provider 1
const web3 = new Web3(new Web3.providers.HttpProvider(`http://${config[provider].host}:${config[provider].port}`));

web3.eth.getAccounts()
.then((accountsList) => {
    const contract = new web3.eth.Contract(
        reservationContractData.contractABI,
        reservationContractData.contractAddress
    )

    interactionTest(contract)
})

function interactionTest (contract) {
    validateReservation(() => {
		console.log("done!")
    })

    function validateReservation(next) {
        contract.methods["validateReservation"](
            '0x01'  // productId
        ).send({
			gas: 6492410,
			from: config[provider].account,
			privateFor: [config.regulator.pubkey]
        }).then(tx => {
            console.log(`Successfully validated product. Gas used: ${ tx.gasUsed } Transaction hash: ${ tx.transactionHash }`);

            next();
        })
    }
}

