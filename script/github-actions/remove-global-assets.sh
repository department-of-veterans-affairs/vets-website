#!/bin/bash

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

# ls $WORKDIR/generated/

# Move app assets to temp directory and sync with 'generated'
mkdir generated-assets/
for v in $(tr ',' '\n' <<< "$filesToSync") ; do find $WORKDIR/generated/ -name "$v.*" -exec cp {} generated-assets/ \;; done
rsync -a --delete --remove-source-files generated-assets/ $WORKDIR/generated/
rm -rf generated-assets/
