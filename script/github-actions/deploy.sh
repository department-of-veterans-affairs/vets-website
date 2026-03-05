#!/bin/bash -e

# application-build.sh
# deploys the assets of a given tarball in s3 to s3 asset bucket

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
if [ -z "$SOURCE" ] || [ -z "$DEST" ]; then
    say_err "ERROR: Missing required source or destination"
    usage
    exit 1
fi

say "INFO: Starting up..."
say "INFO:  -> Deploying $SOURCE to $DEST"
if [ -n "$ASSET_DEST" ] ; then
    say "INFO:  -> Will also sync assets to $ASSET_DEST"
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

# Fetch source tarbell from s3 and determine decompression tool
say "INFO: Fetching source..."
aws s3 --only-show-errors cp "$SOURCE" .
file=$(basename "$SOURCE")
build_file_type=$(file "$file")
if echo "$build_file_type" | grep -q "gzip compressed data" ; then
    # XXX add pigz to jenkins ami builds, and switch to using that for 10 second savings
    say "INFO: Detected gzip compression, using gzip"
    compress="--use-compress-program=gzip"
elif echo "$build_file_type" | grep -q "bzip2 compressed data" ; then
    say "INFO: Detected bzip compressed data, using -j"
    compress="-j"
elif echo "$build_file_type" | grep -q "Zstandard compressed data" ; then
    say "INFO: Detected zstd compression, using --zstd"
    compress="--zstd"
fi

# Unzip source into build directory
say "INFO: Expanding source into build/"
mkdir build
tar -x $compress -C build -f "$(basename "$SOURCE")"

# Copy assets from build directory into assets directory, excluding HTML files
if [ ! -f build/BUILD.txt ] ; then
    say_err "ERROR: BUILD.txt file missing from source tarball"
    exit 1
fi

if [ -n "$ASSET_DEST" ] ; then
    say "INFO: Prepping assets for $ASSET_DEST"
    mkdir assets
    rsync -a --exclude '*.asp' --exclude '*.html' build/ assets/
    cd assets

    # XXX: switch this to pigz for 15 seconds of savings
    say "INFO: Compressing text assets"
    find . \
        \( \
        -name '*.js' -o \
        -name '*.css' -o \
        -name '*.ico' -o \
        -name '*.txt' -o \
        -name '*.xml' -o \
        -name '*.ttf' -o \
        -name '*.svg' \
        \) \
        -exec gzip -n {} \; -exec mv {}.gz {} \;

    # Sync text assets to s3
    say "INFO: Syncing compressed assets to $ASSET_DEST"
    aws s3 sync --only-show-errors \
        --acl public-read \
        --content-encoding gzip \
        --cache-control "public, no-cache" \
        --exclude '*' \
        --include '*.js' \
        --include '*.css' \
        --include '*.ico' \
        --include '*.txt' \
        --include '*.xml' \
        --include '*.ttf' \
        --include '*.svg' \
        --exclude generated/styleConsolidated.css \
        --exclude generated/polyfills.entry.js \
        --exclude generated/vendor.entry.js \
        --exclude generated/proxy-rewrite.entry.js \
        --exclude js/settings.js \
        --exclude js/vendor/uswds.min.js \
         . "$ASSET_DEST"

    # XXX: This list should come from `vets-website` build
    say "INFO: Re-sync subset with shorter cache control to $ASSET_DEST"
    aws s3 sync --only-show-errors \
        --acl public-read \
        --content-encoding gzip \
        --cache-control "public, no-cache" \
        --exclude '*' \
        --include generated/styleConsolidated.css \
        --include generated/polyfills.entry.js \
        --include generated/vendor.entry.js \
        --include generated/proxy-rewrite.entry.js \
        --include js/settings.js \
        --include js/vendor/uswds.min.js \
        . "$ASSET_DEST"

    say "INFO: Syncing assets to $ASSET_DEST"
    aws s3 sync --only-show-errors \
        --acl public-read \
        --cache-control "public, no-cache" \
        . "$ASSET_DEST"

    cd ..
fi

cd build

say "INFO: Syncing assets to $DEST"
aws s3 sync --only-show-errors \
    --acl public-read \
    --cache-control "public, no-cache" \
    --exclude '*' \
    --include '*.css' \
    --include '*.js' \
    --include '*.png' \
    --include '*.jpg' \
    --include '*.svg' \
    --include '*.woff2' \
    --include '*.ttf' \
    . "$DEST"

say "INFO: Syncing all content to $DEST"
aws s3 sync --only-show-errors \
    --acl public-read \
    --cache-control "public, no-cache" \
    --delete \
    . "$DEST"

cd ..

if [ -n "$ASSET_DEST" ] ; then
    cd assets
    
    say "INFO: Cleanup sync for $ASSET_DEST"
    aws s3 sync --only-show-errors \
    --acl public-read \
    --cache-control "public, no-cache" \
    --delete \
    . "$ASSET_DEST"

    cd ..
fi

EXIT_OK=yes
