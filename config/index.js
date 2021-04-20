module.exports = {
    EMAIL: {
      SMTP: {
        SERVICE: 'gmail',
        FROM: {
          EMAIL: process.env.EMAIL_SMTP_FROM_EMAIL || 'ccetsii@ull.edu.es',
          NAME: process.env.EMAIL_SMTP_FROM_NAME || 'SPC19 Notification'
        },
        AUTH: {
          USERNAME: process.env.EMAIL_SMTP_AUTH_USERNAME || 'ccetsii@ull.edu.es',
          PASSWORD: process.env.EMAIL_SMTP_AUTH_PASSWORD || 'CentCalc19'
        }
      },
      LINK_DEST_VALIDATION: process.env.EMAIL_LINK_DEST_VALIDATION || 'http://<T3_APP>/reservation/validate/<CONTRACT>',
      LINK_DEST_DETAIL: process.env.EMAIL_LINK_DEST_DETAIL || 'http://<T3_APP>/reservation/<CONTRACT>',
    },
    orion: {
      taker: {
        publicKey: process.env.TAKERPUBLICKEY || "Ko2bVqD+nNlNYL5EE7y3IdOnviftjiizpjRt+HTuFBs="
      },
      insurer: {
        publicKey: process.env.INSURERPUBLICKEY || "A1aVtMxLCUHmBVHXoZzzBgPbW/wj5axDpW9X8l91SGo="
      },
      laboratory: {
        publicKey: process.env.LABORATORYPUBLICKEY || "k2zXEin4Ip/qBGlRkJejnGWdP9cjkK+DAvKNW31L2C8="
      }
    },
    spc19ContractAddress: process.env.SPC19CONTRACTADDRESS,
    besu: {
      privacyGroupId: process.env.PRIVACYGROUPID || "7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M=",
      contractABIFile: process.env.CONTRACTABIFILE || "PCR.json",
      node: {
        url: process.env.BESUNODEURL || "http://127.0.0.1:20002",
        wsUrl: process.env.BESUNODEWSURL || "ws://127.0.0.1:20003",
        privateKey: process.env.BESUNODEPRIVATEKEY || "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
      }
    },
    providerMap: process.env.PROVIDERS_MAP
      ? JSON.parse(process.env.PROVIDERS_MAP)
      : {
        'default': '35.240.26.255:90',
        'spc19_insurer@mailinator.com': '35.240.26.255:92',
        'spc19_laboratory@mailinator.com': '35.240.26.255:91'
      }
}