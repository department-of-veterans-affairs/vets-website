#!/bin/sh

##
# Run the application build using esbuild.
# Drop-in replacement for build.sh when using esbuild.
###

assetSource="local"
buildtype="localhost"

# Save the arguments to this script for later
args="$*"

# Get options
for o in "$@"; do
    case "${o}" in
        --asset-source)
            assetSource="$2"
            shift
            shift
            ;;
        --asset-source=*)
            assetSource="${o#*=}"
            shift
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
        --entry)
            entry="$2"
            shift
            shift
            ;;
        --entry=*)
            entry="${o#*=}"
            shift
            ;;
        --verbose)
            shift
            ;;
        --scaffold)
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

# Only run build if the assetSource = local
if [ "${assetSource}" = "local" ]; then
    echo "Building application assets with esbuild"
    entryArg=""
    if [ -n "${entry}" ]; then
        entryArg="--entry=${entry}"
    fi
    node script/esbuild.js --buildtype="${buildtype}" --destination="${destination}" ${entryArg}

    # Copy vendor -> shared-modules (same as webpack build)
    if [ -f "${buildDir}generated/vendor.entry.js" ]; then
        cp -v "${buildDir}generated/vendor.entry.js" "${buildDir}generated/shared-modules.entry.js"
    fi
else
    echo "Will fetch application assets from the content build script"
fi
