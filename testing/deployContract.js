const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22001"));
const fs = require("fs");
const solc = require("solc");
const config = require('./config')

const contractToCompile = "ReservationContract"; // .sol (in local directory)
const contractDetailsOutputFile = `${ __dirname }/reservationContractData.js`;

let contractAccount; // will be assigned later

// Let's see the list of available accounts first.
console.log(`Listing available accounts...`);
web3.eth.getAccounts().then((accountsList) => {

	console.log(`Available accounts (${ accountsList.length }):\r\n${ accountsList.join("\r\n") }`);
	contractAccount = accountsList[0];
	console.log(`We will deploy contract from account ${ contractAccount }`);

	// unlock account
	const ACCOUNT_PASSWORD = 'Passw0rd'
	for (account in accountsList) {
		console.log('>> Unlocking account ' + accountsList[account])
		web3.eth.personal.unlockAccount(accountsList[account], ACCOUNT_PASSWORD, 36000)
		console.log(`>> Account ${accountsList[account]} unlocked`)
	}

	compile(contractToCompile);
});

function compile (contractName) {

	console.log(`Compiling ${ contractName }.sol...`);

	const contractCode = fs.readFileSync(`${ contractName }.sol`).toString();
    const compiledCode = solc.compile(contractCode);
    console.log(compiledCode.errors)
	const reservation_abiDefinition = JSON.parse(compiledCode.contracts[`:ReservationContract`].interface);
	const reservationContract = new web3.eth.Contract(reservation_abiDefinition)

	deploy("ReservationContract", reservationContract, compiledCode, reservation_abiDefinition);
}

function deploy (contractName, contract, compiledCode, abiDefinition) {

	console.log(`Preparing ${ contractName } contract to be deployed...`);

	const preparedContract = contract.deploy({
		data: '0x' + compiledCode.contracts[`:${ contractName }`].bytecode,
		gas: 4700000,
		arguments: [
			// first argument: array of names (which we need to convert to HEX)
			// listOfCandidates.map(name => web3.utils.asciiToHex(name))
			web3.utils.asciiToHex("id"),
			web3.utils.asciiToHex("crsId"),
			web3.utils.asciiToHex("sellChannel"),
			web3.utils.asciiToHex("customerName"),
			web3.utils.asciiToHex("customerSurname"),
			web3.utils.asciiToHex("bcuesta@opencanarias.es"),
			web3.utils.asciiToHex("customerCountry")
		]
	}, (err) => err && console.error(err));

	preparedContract.estimateGas().then((gas) => {

		console.log(`Gas estimation for deploying this contract: ${ gas }`);

		preparedContract.send({
			from: contractAccount,
			gas: gas + 100000,
			privateFor: [config.provider1.pubkey]
		}).then((deployedContract) => {

			console.log(
				`Contract successfully deployed, contract address: ${ 
				deployedContract.options.address }`
			);

			fs.writeFileSync( // save contract info to a file to access contract data from the client
				contractDetailsOutputFile,
				`module.exports = {\n`
				+ `contractAddress:"${ deployedContract.options.address }",\n`
				+ `contractABI: ${ JSON.stringify(abiDefinition) },\n`
				+ `testAccount: "${ contractAccount }"\n`
				+ `}`
			)
		})
	})
}