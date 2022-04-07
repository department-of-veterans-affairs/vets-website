#!/bin/bash -e

# Removes global assets from the given build directory. This is
# called before archiving single/grouped app builds to S3.

# Exit if app entry names or directories are missing
if [ -z "$ENTRY_NAMES" ] || [ -z "$APP_DIRS" ] || [ -z "$BUILD_DIR" ]; then
    echo "Error: Missing entry names, app directories, or build directory."
    exit 1
fi

# Generate arrays for entry names, chunk ids, and lazy loaded Webpack chunk names.
# Chunk ids follow the convention of the 'named' option that's set in the Webpack config.
entryNames=($ENTRY_NAMES)
chunkIds=($(echo $APP_DIRS | tr '/' '_'))
webpackChunkNames=($(grep -r 'webpackChunkName:' $APP_DIRS | grep -o '"[^"]\+"' | tr -d \"))

# Generate array of file patterns to sync
filesToSync=("${entryNames[@]/%/.*}" "${chunkIds[@]/%/*}" "${webpackChunkNames[@]/%/.*}")

if [ -z "$chunkIds" ] || [ -z "$webpackChunkNames" ]; then echo "No lazy loaded app chunks found."; fi
echo "Files to sync:" && printf "%s\n" "${filesToSync[@]}"

# Make temp directory for storing filtered app assets
tempdir=$(mktemp -d) && mkdir -p $tempdir/generated

# Move app assets and BUILD.txt to temp directory
for filename in ${filesToSync[@]} ; do find $BUILD_DIR/generated/ -name "$filename" -exec cp {} $tempdir/generated/ \;; done
cp $BUILD_DIR/BUILD.txt $tempdir

# Sync temp directory into build directory and delete global assets
rsync -a --delete --remove-source-files $tempdir/ $BUILD_DIR/

# Clean up
rm -rf $tempdir
