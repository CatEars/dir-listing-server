#!/bin/bash

SCRIPT_PATH=$(realpath $0)
SCRIPT_FOLDER=$(dirname $SCRIPT_PATH)
MAIN_FOLDER=$(dirname $SCRIPT_FOLDER)
cd $MAIN_FOLDER

echo "Installing dependencies"
npm i

echo "Building the application"
npm run build

echo "Building the docker image"
docker build . -t dir-listing

echo "Finished building the docker image!"
