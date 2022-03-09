#!/bin/sh

# Exit if app entry names or directories are missing
if [ -z "$ENTRIES" ] || [ -z "$DIRECTORIES" ] || [ -z "$WORKDIR" ]; then
    echo "ERROR: Missing app directories, entries, or working directory"
    exit 1
fi

# Get chunk file names from application directories if any exist
webpackChunkNames=$(grep -r 'webpackChunkName:' $(eval echo "{,$DIRECTORIES}") | grep -o '"[^"]\+"' | tr -d \" | tr '\n', ',')
if [ -z "$webpackChunkNames" ]; then echo "No app chunks found"; fi

# Generate string of filenames to sync
filesToSync="$ENTRIES,$webpackChunkNames"
echo "File names to sync: $filesToSync"

# Delete non app assets
mkdir assets/
rsync -a --delete $(eval echo "--include={,$filesToSync}.*") --exclude='*' $WORKDIR/generated/ assets/
rsync -a --delete assets/ $WORKDIR/generated/
rm -rf assets
