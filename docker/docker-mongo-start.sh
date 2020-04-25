#! /bin/sh


# Set PROJECT_DIR to the parent folder of this folder
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" >/dev/null && pwd )"

echo $PROJECT_DIR


NAME_CONTAINER=s4s-mongo
NAME_CONTAINER_RESTORE=s4s-mongo-backup-restore-temp

# PORT_MACHINE=27017
# PORT_DOCKER=27017
#S4S_CLIENT_ID=****PUT S4S CLIENT ID HERE *************
#S4S_CLIENT_SECRETE=****PUT S4S CLIENT SECRET HERE ****

# Remove existing docker container (comment it out if it doesn't exist)
docker rm ${NAME_CONTAINER}

# Create docker network (comment it out if it already exists)
# docker network create s4s-supplement-dev

# Start the mongdb container
docker run \
    -d \
    --name ${NAME_CONTAINER} \
    -v ${PROJECT_DIR}:/s4s-supplment-service \
    --network s4s-supplement-dev \
    mongo

    # -p ${PORT_MACHINE}:${PORT_DOCKER} \

# Start another mongo container to restore the ibmclouddb database

    # --rm \

docker run \
    -it \
    --name ${NAME_CONTAINER_RESTORE} \
    -v ${PROJECT_DIR}:/s4s-supplment-service \
    --network s4s-supplement-dev \
    mongo \
    /bin/sh -c "mongorestore --host s4s-mongo /s4s-supplment-service/db_backup/rapid_dev_test_demo_backup_2020_04_24"
