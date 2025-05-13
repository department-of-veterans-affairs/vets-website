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
    
    # Find the vendor.entry.js file with its content hash
    vendorFile=$(find "${buildDir}generated" -name "vendor.*.entry.js")
    if [ -n "$vendorFile" ]; then
        # Extract the content hash from the vendor file
        contentHash=$(echo "$vendorFile" | sed -E 's/.*vendor\.([^.]+)\.entry\.js/\1/')
        # Copy with the same content hash
        cp -v "$vendorFile" "${buildDir}generated/shared-modules.${contentHash}.entry.js"
    else
        echo "Warning: vendor.entry.js not found in ${buildDir}generated/"
    fi
else
    echo "Will fetch application assets from the content build script"
fi
