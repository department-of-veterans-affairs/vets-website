#!/bin/sh

##
# Run the application and content builds.
###

assetSource="local"
buildtype="localhost"

# Save the arguments to this script for later; they get drained in the following for loop
args="$*"

# Prepend "--env" to all args so they get passed to the Webpack config
webpackArgs=$(echo "${args}" | sed -E 's/--([^ =]+)/--env \1/g')

webpackArgs="$webpackArgs --env parallel=true"
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
        --destination)
            destination="$2"
            shift
            shift
            ;;
        --destination=*)
            destination="${o#*=}"
            shift
            ;;
        *)
            ;;
    esac
done

# If destination flag is absent, use buildtype as destination
destination="${destination:-$buildtype}"

echo "assetSource: ${assetSource}"
echo "buildtype: ${buildtype}"
echo "destination: ${destination}"

buildDir="$(dirname "$0")/../build/${destination}/"
if [ -d "${buildDir}" ]; then
    echo "Removing build/${destination}"
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
