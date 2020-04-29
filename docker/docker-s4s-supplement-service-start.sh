#! /bin/sh


# Set PROJECT_DIR to the parent folder of this folder
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" >/dev/null && pwd )"

echo $PROJECT_DIR


NAME_CONTAINER=s4s-sup

PORT_MACHINE=33000
PORT_DOCKER=3000
NODE_HOST=0.0.0.0

#S4S_CLIENT_ID=****PUT S4S CLIENT ID HERE *************
#S4S_CLIENT_SECRETE=****PUT S4S CLIENT SECRET HERE ****

# Remove existing docker container (comment it out if it doesn't exist)
docker rm ${NAME_CONTAINER}

# Create docker network (comment it out if it already exists)
# docker network create s4s-supplement-dev

# Start the mongdb container
docker run \
    -it \
    --name ${NAME_CONTAINER} \
    -v ${PROJECT_DIR}:/s4s-supplment-service \
    --network s4s-supplement-dev \
    -p ${PORT_MACHINE}:${PORT_DOCKER} \
    node \
    /bin/bash -c "cd /s4s-supplment-service && \
    npm install && \
    npm install -g nodemon && \
    export VCAP_APP_HOST=${NODE_HOST} && \
    export VCAP_APP_PORT=${PORT_DOCKER} && \
    export DB_ENVIRONMENT=DEV && \
    export MONGODB_HOST=s4s-mongo && \
    export MONGODB_PORT=27017 && \
    export MONGODB_DBNAME=ibmclouddb && \
    export MONGODB_TEST_DBNAME=ibmclouddb && \
    npm run start-dev"
