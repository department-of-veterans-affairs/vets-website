#!/bin/sh

##
# Run the application and content builds. This script builds or fetches the
# pre-built application assets based on the --asset-source option.
###

# Default to local
assetSource="local"

# Save the arguments to this script for later; they get drained in the following for loop
args="$*"

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
        *)
            ;;
    esac
done

echo "assetSource: ${assetSource}"

# Only run Webpack if the assetSource = local
if [ "${assetSource}" = "local" ]; then
    echo "Building application assets"
    # yarn build:webpack "${args}"
else
    echo "Will fetch application assets from the content build script"
fi

# Always build the content
# yarn build:content "${args}"
