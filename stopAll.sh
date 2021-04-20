#!/bin/bash

echo "Removing executing containers..."
for container_name in insurer taker; do
    if [ "$( docker container inspect -f '{{.State.Running}}' catedrabob-spc19-ens-$container_name )" == "true" ]; then
        echo "Removing container catedrabob-spc19-ens-$container_name ..."
        docker rm -f catedrabob-spc19-ens-$container_name
    fi
done