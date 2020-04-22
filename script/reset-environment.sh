#!/usr/bin/env bash
if ! [ -x "$(command -v yarn)" ]; then
    echo "Installing yarn..."
    npm i -g yarn@1.21.1
    if [ $? -eq 0 ]; then
        echo "Yarn successfulling installed globally."
    else
        echo "Yarn failed to install...please install manually."
        exit 1
    fi
else
    yarn_version=$(yarn --version)
    if [ "$yarn_version" != "1.21.1" ]; then
        echo "Install yarn version 1.21.1 [y/N]: "
        read input
        case "$input" in
            y|Y|yes|Yes)
                npm i -g yarn@1.21.1
                ;;
            *)
                ;;
        esac
    fi
fi

echo "Removing Babel cache..."
rm -rf ./.babelcache
if [ $? -eq 0 ]; then
    echo "Successfully cleaned out .babelcache."
else
    echo "Please manually remove your .babelcache folder."
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
    echo "Please manually check your ./node_modules folder for issues."
fi
