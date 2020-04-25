#! /bin/sh


# Set PROJECT_DIR to the parent folder of this folder
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" >/dev/null && pwd )"

echo $PROJECT_DIR


NAME_CONTAINER=s4s-mongocli

docker rm ${NAME_CONTAINER}

docker run \
    -it \
    --name ${NAME_CONTAINER} \
    -v ${PROJECT_DIR}:/s4s-supplment-service \
    --network s4s-supplement-dev \
    mongo \
    /bin/bash
