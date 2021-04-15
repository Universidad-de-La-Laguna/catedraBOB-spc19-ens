module.exports = {
contractAddress:"0x0cd2e26497DCAD2bE1f1fD86A6286D71dA4d44dF",
contractABI: [{"constant":false,"inputs":[{"name":"_id","type":"uint256"},{"name":"_name","type":"string"},{"name":"_price","type":"uint256"},{"name":"_numAdults","type":"uint256"},{"name":"_numChildren","type":"uint256"},{"name":"_numBabies","type":"uint256"},{"name":"providerId","type":"string"},{"name":"providerName","type":"string"},{"name":"providerEmail","type":"string"},{"name":"_providerAccount","type":"address"}],"name":"registerProduct","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x2ce43157"},{"constant":true,"inputs":[],"name":"getProductsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5786fd40"},{"constant":false,"inputs":[{"name":"productId","type":"uint256"}],"name":"validateReservation","outputs":[{"name":"validated","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xc9e08533"},{"constant":true,"inputs":[],"name":"getReservation","outputs":[{"name":"","type":"bytes"},{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xe8c6a4d7"},{"constant":true,"inputs":[],"name":"getTotalPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xf475409f"},{"inputs":[{"name":"_id","type":"string"},{"name":"_crsId","type":"string"},{"name":"_sellChannel","type":"string"},{"name":"customerName","type":"string"},{"name":"customerSurname","type":"string"},{"name":"customerEmail","type":"string"},{"name":"customerCountry","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"providerEmail","type":"string"},{"indexed":false,"name":"reservationId","type":"string"}],"name":"RegisterProductEvent","type":"event","signature":"0x90d836784c927b3a569e16e67b5c2008509d8955d351606c159d8b84f0bbfdd3"},{"anonymous":false,"inputs":[{"indexed":false,"name":"customerEmail","type":"string"},{"indexed":false,"name":"reservationId","type":"string"},{"indexed":false,"name":"productId","type":"uint256"}],"name":"ValidationDoneEvent","type":"event","signature":"0x5152e314c8a0962aa2f97b3ddf78e0b1f24c1f297af4ed3272ce15040da018d3"}],
testAccount: "0x74d4C56d8dcbC10A567341bFac6DA0A8F04DC41d"
}