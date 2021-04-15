module.exports = {
    // quorumnode: {
    //     host: process.env.QUORUMNODE_HOST || '127.0.0.1',
    //     port: process.env.QUORUMNODE_PORT || '22001'
    // },
    contract: {
        abi: require('../contract/contractABI.json')
    },
    EMAIL: {
        SMTP: {
          SERVICE: 'gmail',
          FROM: {
            EMAIL: process.env.EMAIL_SMTP_FROM_EMAIL || 't3opencanarias@gmail.com',
            NAME: process.env.EMAIL_SMTP_FROM_NAME || 'Alastria DemoDay'
          },
          AUTH: {
            USERNAME: process.env.EMAIL_SMTP_AUTH_USERNAME || 't3opencanarias@gmail.com',
            PASSWORD: process.env.EMAIL_SMTP_AUTH_PASSWORD || 'Nov11nov$'
          }
        },
        LINK_DEST_VALIDATION: process.env.EMAIL_LINK_DEST_VALIDATION || 'http://<T3_APP>/reservation/validate/<CONTRACT>',
        LINK_DEST_DETAIL: process.env.EMAIL_LINK_DEST_DETAIL || 'http://<T3_APP>/reservation/<CONTRACT>',
    },
    besu: {
      privacyGroupId: process.env.PRIVACYGROUPID || "7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M=",
      node: {
        wsUrl: process.env.BESUNODEWSURL || "ws://127.0.0.1:20003",
      }
    },
    // providerMap: process.env.PROVIDERS_MAP
    //     ? JSON.parse(process.env.PROVIDERS_MAP)
    //     : {
    //         'default': '35.240.26.255:90',
    //         'prov1_demoalastria@mailinator.com': '35.240.26.255:91',
    //         'prov2_demoalastria@mailinator.com': '35.240.26.255:92'
    //     }
}