#!/bin/bash

echo "Removing executing containers..."
for container_name in insurer taker; do
    if [ "$( docker container inspect -f '{{.State.Running}}' catedrabob-spc19-ens-$container_name )" == "true" ]; then
        echo "Removing container catedrabob-spc19-ens-$container_name ..."
        docker rm -f catedrabob-spc19-ens-$container_name
    fi
done

echo "Building image..."
docker build -t catedrabob-spc19-ens .

if [ "$( docker container inspect -f '{{.State.Running}}' catedrabob-spc19-api-taker )" != "true" ]; then
    echo "ERROR: Es necesario que esté ejecutandose el contenedor catedrabob-spc19-api-taker"
    exit 1
fi

echo "Getting SPC19 general contract address from container catedrabob-spc19-api-taker..."
SPC19CONTRACTADDRESS=$(docker logs catedrabob-spc19-api-taker | grep "SPC19CONTRACTADDRESS" | sed 's/.*SPC19CONTRACTADDRESS=\(.*\)/\1/')
echo "SPC19 general contract address: $SPC19CONTRACTADDRESS"

echo "Running container catedrabob-spc19-ens-taker..."
docker run -d \
   --name catedrabob-spc19-ens-taker \
   -e PRIVACYGROUPID=7LGGJ9igv9hZvgyLtTF7hTtisABHmFsNZLhsTzBPS2M= \
   -e BESUNODEURL=http://spc19-test-network_member2besu_1:8545 \
   -e BESUNODEWSURL=ws://spc19-test-network_member2besu_1:8546 \
   -e CONTRACTABIFILE=PCR.json \
   -e SPC19CONTRACTADDRESS=$SPC19CONTRACTADDRESS \
   --network spc19-test-network_quorum-dev-quickstart \
   catedrabob-spc19-ens

echo "Running container catedrabob-spc19-ens-insurer..."
docker run -d \
   --name catedrabob-spc19-ens-insurer \
   -e PRIVACYGROUPID=DyAOiF/ynpc+JXa2YAGB0bCitSlOMNm+ShmB/7M6C4w= \
   -e BESUNODEURL=http://spc19-test-network_member1besu_1:8545 \
   -e BESUNODEWSURL=ws://spc19-test-network_member1besu_1:8546 \
   -e CONTRACTABIFILE=Insurance.json \
   -e SPC19CONTRACTADDRESS=$SPC19CONTRACTADDRESS \
   --network spc19-test-network_quorum-dev-quickstart \
   catedrabob-spc19-ens