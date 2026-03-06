#!/bin/bash -e

# Partial deploy for single/grouped app builds.

ME=$(basename "$0")

ASSET_DEST=""
DEST=""
SOURCE=""
VERBOSE="no"
WORKDIR="."
EXIT_OK=no

function usage {
    echo "$ME: perform a sync'ed deploy of static assets using 'aws s3 sync'"
    echo "Usage: $ME -s SOURCE -d DEST [-a ASSET_DEST] [-w WORKDIR] [-v]"
    echo "  -s : An S3 URL to the build tarball object"
    echo "  -d : An S3 URL to the website bucket to deploy to"
    echo "  -a : An S3 URL to the asset bucket to deploy to"
    echo "  -w : local fs path to work in, defaults to current dir"
    echo "  -v : Use verbose output"
}

function say {
    if [ "$VERBOSE" == "yes" ] ; then
        echo "$1"
    fi
}

function say_err {
    >&2 echo "$1"
}

function bail {
    say_err "$1"
    exit 2
}

while getopts ":a:d:s:vw:h" option ; do
    case $option in
        a) ASSET_DEST="$OPTARG" ;;
        d) DEST="$OPTARG" ;;
        s) SOURCE="$OPTARG" ;;
        v) VERBOSE="yes" ;;
        w) WORKDIR="$OPTARG" ;;
        \?) bail "Invalid option: $OPTARG" ;;
        h) usage ; exit 0 ;;
        *) bail "Something went wrong with argument parsing, use the -h arg for help" ;;
    esac
done
shift $((OPTIND - 1))

# Exit if source or destination is missing
if [ -z "$SOURCE" ] || [ -z "$ASSET_DEST" ] || [ -z "$DEST" ]; then
    say_err "ERROR: Missing required source or destination"
    usage
    exit 1
fi

# Create working directory
dir=$(mktemp -d "$WORKDIR/$ME.XXXXXX")
say "INFO: Created $dir to work in"

# Exit when script is finished or aborted
function finish {
    say "INFO: Exiting ..."
    if [ -n "$OLD_PWD" ] ; then
        cd "$OLD_PWD"
    fi
    if [ -d "$dir" ] ; then
        say "INFO: Removing $dir"
        rm -rf "$dir"
    fi
    if [ $EXIT_OK != "yes" ] ; then
        say_err "ERROR: Script aborted early, deploy may be in an incosistent state!"
        exit 1
    fi
}
trap finish EXIT

OLD_PWD=$PWD
cd "$dir"

# Fetch source tarbell from S3
say "INFO: Fetching source..."
aws s3 --only-show-errors cp "$SOURCE" .

# Set 'tar' options based on source type
file=$(basename "$SOURCE")
build_file_type=$(file "$file")
if echo "$build_file_type" | grep -q "gzip compressed data" ; then
    say "INFO: Detected gzip compression, using gzip"
    compress="--use-compress-program=gzip"
elif echo "$build_file_type" | grep -q "bzip2 compressed data" ; then
    say "INFO: Detected bzip compressed data, using -j"
    compress="-j"
elif echo "$build_file_type" | grep -q "Zstandard compressed data" ; then
    say "INFO: Detected zstd compression, using --zstd"
    compress="--zstd"
fi

# Extract source into 'build' directory
say "INFO: Expanding source into build/"
mkdir build
tar -x $compress -C build -f "$(basename "$SOURCE")"

# Copy filtered assets into 'assets' directory. The build should already
# only contain application assets, but exclude global assets just to be safe
say "INFO: Filtering assets for S3 sync"
mkdir assets
rsync -a \
    --exclude 'BUILD.txt' \
    --exclude 'generated/node_modules*' \
    --exclude 'generated/polyfills*' \
    --exclude 'generated/shared-modules.*' \
    --exclude 'generated/style.*' \
    --exclude 'generated/styleConsolidated.*' \
    --exclude 'generated/va-medallia-styles.*' \
    --exclude 'generated/vendor*' \
    --exclude 'generated/web-components.*' \
    --include 'generated/' \
    --include '*.js*' \
    --include '*.css*' \
    --include '*.txt' \
    --exclude '*' \
    build/ assets/

cd assets

# Sync assets to S3 website (reverse proxy) bucket
say "INFO: Syncing assets to $DEST"
aws s3 sync --only-show-errors \
    --acl public-read \
    --cache-control "public, no-cache" \
    --exclude '*' \
    --include '*.js*' \
    --include '*.css*' \
    . "$DEST"

# Compress assets
say "INFO: Compressing assets"
find . \
    \( \
    -name '*.js*' -o \
    -name '*.css*' -o \
    -name '*.txt' \
    \) \
    -exec gzip -n {} \; -exec mv {}.gz {} \;

# Sync compressed assets to S3 asset bucket
say "INFO: Syncing compressed assets to $ASSET_DEST"
aws s3 sync --only-show-errors \
    --acl public-read \
    --content-encoding gzip \
    --cache-control "public, no-cache" \
    --exclude '*' \
    --include '*.js*' \
    --include '*.css*' \
    --include '*.txt' \
    . "$ASSET_DEST"

# Exit successfully
EXIT_OK=yes
