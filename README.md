# SPC19 - Event Notification Service

Servicio de notificación de eventos. Permite la suscripción a los eventos de varios contratos con un mismo `privacy Group`

Recibe por configuración el `privacyGroupId` al que se quiere escuchar, y el webservice endpoint del nodo local de Hyperledger Besu local. Por defecto, usa el `privacyGroupId` asociado a la combinación `[ taker, laboratory ]`, y el endpoint del nodo del `taker` (hotel) del proyecto SPC19.

Variables de entorno:

   - PRIVACYGROUPID [ 7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M= ]
   - BESUNODEWSURL [ ws://127.0.0.1:20003 ]

## Uso

Para escuchar los eventos de un nuevo contrato, invocar al método `/new` de la API pasando la dirección del contrato por parámetro. Ejemplo:

```sh
curl http://localhost:8000/new?contract=0xd5167d7ea816d836a6d37fb17ef76a712a9c81a7
```