# SPC19 - Event Notification Service

Servicio de notificación de eventos. Permite la suscripción a los eventos de varios contratos con un mismo `privacy Group`

Recibe por configuración el `privacyGroupId` al que se quiere escuchar, y el webservice endpoint del nodo local de Hyperledger Besu local. Por defecto, usa el `privacyGroupId` asociado a la combinación `[ taker, laboratory ]`, y el endpoint del nodo del `taker` (hotel) del proyecto SPC19.

Variables de entorno:

   - PRIVACYGROUPID [ 7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M= ]
   - BESUNODEWSURL [ ws://127.0.0.1:20003 ]

## Construcción

```sh
docker build . -t catedrabob-spc19-ens
```

## Ejecución

Para la aseguradora:

```
docker run -d \
   --name catedrabob-spc19-ens-insurer \
   -e PRIVACYGROUPID=DyAOiF/ynpc+JXa2YAGB0bCitSlOMNm+ShmB/7M6C4w= \
   -e BESUNODEWSURL=ws://spc19-test-network_member1besu_1:8546 \
   --network spc19-test-network_quorum-dev-quickstart \
   catedrabob-spc19-ens
```

Para el hotel:

```
docker run -d \
   --name catedrabob-spc19-ens-taker \
   -e PRIVACYGROUPID=7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M= \
   -e BESUNODEWSURL=ws://spc19-test-network_member2besu_1:8546 \
   --network spc19-test-network_quorum-dev-quickstart \
   catedrabob-spc19-ens
```

> Nótese que se hace uso de la red docker que utiliza el despliegue de Besu, los nombres de los contenedores de los nodos de Besu y de los puertos internos a los contenedores.