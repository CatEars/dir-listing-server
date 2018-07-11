#!/bin/bash

SCRIPT_PATH=$(realpath $0)
SCRIPT_FOLDER=$(dirname $SCRIPT_PATH)
MAIN_FOLDER=$(dirname $SCRIPT_FOLDER)
cd $MAIN_FOLDER

echo "Minifying CSS"

./node_modules/clean-css-cli/bin/cleancss src/style.css -o dist/style.css

echo "Finished minifying CSS"
