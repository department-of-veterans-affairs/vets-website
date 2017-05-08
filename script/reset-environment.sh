#!/usr/bin/env bash
if ! [ -x "$(command -v yarn)" ]; then
    echo "Installing yarn..."
    npm i -g yarn@0.21.3
    if [ $? -eq 0 ]; then
        echo "Yarn successfulling installed globally."
    fi
fi
echo "Removing the node modules folder..."
rm -rf ./node_modules
if [ $? -eq 0 ]; then
    echo "Successfully cleaned out the node modules folder."
    yarn install
    if [ $? -eq 0 ]; then
        echo "yarn install successfully completed."
    else
        echo "Please manually re-run yarn install from the command line."
    fi
else
    echo "Please manually try check your ./node_modules folder for issues."
fi
