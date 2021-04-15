var Web3 = require('web3')
const config = require('./config')
const reservationContractData = require('./reservationContractData')

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22001"));

web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txnHash);
            if (receipt == null) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
}


web3.eth.getAccounts()
.then((accountsList) => {
    const contract = new web3.eth.Contract(
        reservationContractData.contractABI,
		reservationContractData.contractAddress,
		{
			gas: 300000000,
			gasPrice: '0'
		}
	)
	
    interactionTest(contract)
})

function interactionTest (contract) {

	getNumProducts(() =>
	registerProduct('prov1_demoalastria@mailinator.com', config.provider1.account, () =>
	getNumProducts(() =>
	// registerProduct('prov2_demoalastria@mailinator.com', config.provider2.account, () =>
	getReservation(() => {
		console.log("done!")
	}))))
	// ))))

	function getReservation(next) {
		console.log('consultando reserva...') 

		contract.methods["getReservation"]()
		.call()
		// .send({
		// 	gas: 6492410,
		// 	from: config.regulator.account,
		// 	privateFor: []
		// })
		.then(result => {
			console.log(`resultado: ${JSON.stringify(result)}`)

			next()

			// return web3.eth.getTransactionReceiptMined(result.transactionHash)
		})
		// .then(function (receipt) {
		// 	console.log("receipt");
		// 	console.log(receipt);

		// 	next()
		// })
		.catch(err => {
			console.log(err)
		})	
	} 

	function getNumProducts(next) {
		console.log(`consultanto total price...`)

		contract.methods["getProductsCount"]().call()
		.then(result => {
			console.log(`resultado: ${result}`)

			next()
        })
        .catch(err => {
            console.log(err)
        })
	}

	function registerProduct(email, providerAccount, next) {
		console.log(`registrando producto...`)

		contract.methods["registerProduct"](
			'0x01',                          // id
			web3.utils.asciiToHex("name"),                     // name
			'0x64',                        // price
			'0x01',                          // numAdults
			'0x00',                          // numChildren
			'0x00',                          // numBabies
			web3.utils.asciiToHex("providerId"),               // providerId
			web3.utils.asciiToHex("providerName"),             // providerName
			web3.utils.asciiToHex(email),  // providerEmail
			providerAccount
		).send({
			gas: 6492410,
			from: config.regulator.account,
			privateFor: [config.provider1.pubkey]
		}).then(tx => {
			console.log(`Successfully register product. Gas used: ${ tx.gasUsed } Transaction hash: ${ tx.transactionHash }`);

			next();
		})
	}
}