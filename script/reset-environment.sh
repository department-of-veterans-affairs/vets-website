#!/usr/bin/env bash
echo "Removing the node modules folder..."
rm -rf ./node_module
if [ $? -eq 0 ]; then
    echo "Successfully cleaned out the node modules folder."
    npm i
    if [ $? -eq 0 ]; then
        echo "npm install successfully completed."
    else
        echo "Please manually re-run npm install from the command line."
    fi
else
    echo "Please manually try check your ./node_modules folder for issues."
fi
