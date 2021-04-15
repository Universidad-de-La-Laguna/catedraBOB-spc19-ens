module.exports = {
    regulator: {
        pubkey: process.env.REGULATOR_PUBKEY || "No9CfFXydhQhryXwps+llxZPIpE2wpYA9OB7B432AXM=",
        host: process.env.REGULATOR_HOST || "127.0.0.1",
        port: process.env.REGULATOR_PORT || "22001",
        account: process.env.REGULATOR_ACCOUNT || "0x74d4c56d8dcbc10a567341bfac6da0a8f04dc41d"
    },
    provider1: {
        pubkey: "EOxvbW0cTlSFXCoG484EZR+t08FxavsL42xek4mNVkA=",
        host: "127.0.0.1",
        port: "22002",
        account: "0x0e596199ea5c6d3cbc713183e7514be022a19385"
    },
    provider2: {
        pubkey: "kwoQeFxkbbKCAEl5UuwjGiw8TvNpyzLhThXSzls70Ro=",
        host: "127.0.0.1",
        port: "22003",
        account: "0xab46de840d9f43201f83a31330d5fdb56741de7f"
    },
    reservationContract: {
        address: process.env.RESERVATION_CONTRACT_ADDRESS || '0xF183573F9E17F516136524cC1FF0FF6B36B69Aa8'
    }
}