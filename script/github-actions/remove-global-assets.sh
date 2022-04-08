#!/bin/bash -e

# Removes global assets in a single/grouped app build directory.

# Exit if app entry names or directories are missing
if [ -z "$ENTRY_NAMES" ] || [ -z "$APP_DIRS" ] || [ -z "$BUILD_DIR" ]; then
    echo "Error: Missing entry names, app directories, or working directory."
    exit 1
fi

# Get lazy loaded Webpack chunk filenames from application directories
webpackChunkNames=$(grep -r 'webpackChunkName:' $(eval echo "{,$APP_DIRS}") | grep -o '"[^"]\+"' | tr -d \" | tr '\n', ',')
if [ -z "$webpackChunkNames" ]; then echo "No lazy loaded app chunks found."; fi

# Generate string of filenames to sync
filesToSync="$ENTRY_NAMES,$webpackChunkNames"
echo "Filenames to sync: $filesToSync"

# Make temp directory for storing filtered app assets
tempdir=$(mktemp -d -t assets-XXXXXXXXXX)

# Move app assets to temp directory
for filename in $(tr ',' '\n' <<< "$filesToSync") ; do find $BUILD_DIR/generated/ -name "$filename.*" -exec cp {} $tempdir/ \;; done

# Sync app assets in 'generated' directory and delete global assets
rsync -a --delete --remove-source-files $tempdir/ $BUILD_DIR/generated/

# Remove all files that aren't '.js', '.css', or '.txt'
find $BUILD_DIR/ -type f -not \( -name '*.js' -or -name '*.css' -or -name '*.txt' \) -delete

# Remove 'js' directory with global assets
rm -rf $BUILD_DIR/js

# Clean up
rm -rf $tempdir
find $BUILD_DIR/ -type d -empty -delete
