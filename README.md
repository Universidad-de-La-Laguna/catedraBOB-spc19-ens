# SPC19 - Event Notification Service

Event Notification Service of the project SPC19. Allows the subscription to the events of several contracts with the same `privacy Group`.

It receives by configuration the `privacyGroupId` to listen to, the webservice endpoint of the local Hyperledger Besu node, and the file with the ABI of the contract associated to the events to receive.

By default, it uses the `privacyGroupId` associated with the `[ taker, laboratory ]` combination, the `taker` (hotel) node endpoint of the SPC19 project, and the `PCR.json` contract.

> Note: Contracts must be included as resources in the `contract` folder.

Environment variables:

   - PRIVACYGROUPID [ 7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M= ]
   - BESUNODEWSURL [ ws://127.0.0.1:20003 ]
   - CONTRACTABIFILE [ PCR.json ]

## Build

```sh
docker build . -t catedrabob-spc19-ens
```

## Run

### Insurer:

```
docker run -d \
   --name catedrabob-spc19-ens-insurer \
   -e PRIVACYGROUPID=DyAOiF/ynpc+JXa2YAGB0bCitSlOMNm+ShmB/7M6C4w= \
   -e BESUNODEWSURL=ws://spc19-test-network_member1besu_1:8546 \
   -e CONTRACTABIFILE=PCR.json \
   --network spc19-test-network_quorum-dev-quickstart \
   catedrabob-spc19-ens
```

### Taker (Hotel):

```
docker run -d \
   --name catedrabob-spc19-ens-taker \
   -e PRIVACYGROUPID=7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M= \
   -e BESUNODEWSURL=ws://spc19-test-network_member2besu_1:8546 \
   -e CONTRACTABIFILE=Insurance.json \
   --network spc19-test-network_quorum-dev-quickstart \
   catedrabob-spc19-ens
```

> Note that use is made of the docker network used by the Besu deployment, the container names of the Besu nodes and the internal ports to the containers.