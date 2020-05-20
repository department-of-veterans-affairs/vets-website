#!/bin/sh

##
# Run the application and content builds.
###

assetSource="local"
buildtype="localhost"

# Save the arguments to this script for later; they get drained in the following for loop
args="$*"

# Prepend env. to all args so they get passed to the Webpack config
webpackArgs=$(echo -n "${args}" | sed -E 's/--([^ =]+)/--env.\1/g')

# Get options
for o in "$@"; do
    case "${o}" in
        --asset-source)
            assetSource="$2"
            shift # past "--asset-source"
            shift # past value
            ;;
        --asset-source=*)
            assetSource="${o#*=}" # grab the value
            shift # past the --asset-source=value
            ;;
        --buildtype)
            buildtype="$2"
            shift
            shift
            ;;
        --buildtype=*)
            buildtype="${o#*=}"
            shift
            ;;
        *)
            ;;
    esac
done

echo "assetSource: ${assetSource}"
echo "buildtype: ${buildtype}"
echo

buildDir="$(dirname "$0")/../build/${buildtype}/"
if [ -d "${buildDir}" ]; then
    echo "Removing build/${buildtype}"
    rm -r "${buildDir}"
fi

# Only run Webpack if the assetSource = local
if [ "${assetSource}" = "local" ]; then
    echo "Building application assets"
    yarn build:webpack $webpackArgs
    cp -v "${buildDir}generated/vendor.entry.js" "${buildDir}generated/shared-modules.entry.js"
else
    echo "Will fetch application assets from the content build script"
fi

# Always build the content
yarn build:content $args
