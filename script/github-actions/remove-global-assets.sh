#!/bin/bash -e

# Removes global assets from the given build directory. This is
# called before archiving single/grouped app builds to S3.

# Function to check if a file has been processed
is_processed() {
    local target="$1"
    local i
    for i in "${processedFiles[@]}"; do
        if [[ "$i" == "$target" ]]; then
            return 0  # Found, return true
        fi
    done
    return 1  # Not found, return false
}

# Function that extracts webpack dependencies from a single file
# Returns a space-separated list of chunk names
extract_deps_from_file() {
    local file="$1"
    local deps=""
    
    # Find webpack require.e patterns: __webpack_require__.e("chunk-name")
    # Also finds minified patterns: n.e("chunk-name")
    local webpackRequireChunks=$(grep -o "[a-zA-Z0-9_]*\.[a-z]([\"']\{1\}[^\" ]*[\"']\{1\})" "$file" 2>/dev/null | grep -o '"[^"]*"' | tr -d '"' || echo "")
    
    # Find webpack comment patterns: /*! import() | chunk-name */
    local webpackCommentChunks=$(grep -o '/\*!.*import().*|.*\*/' "$file" 2>/dev/null | grep -o '|[^*]*\*/' | sed 's/|//g' | sed 's/\*\///g' | tr -d ' ' || echo "")
    
    # Find Promise.all patterns with webpack requires
    local promiseAllChunks=$(grep -o 'Promise.all(\[[^]]*\])' "$file" 2>/dev/null | grep -o '__webpack_require__\.e([^)]*' | grep -o '"[^"]*"' | tr -d '"' || echo "")
    
    # Combine all found chunks
    deps="$webpackRequireChunks $webpackCommentChunks $promiseAllChunks"
    
    echo "$deps"
}

# Function to process a chunk dependency
# Returns true if a new dependency was found and added
process_chunk() {
    local chunk="$1"
    local found_new=false
    
    # Only process non-empty chunks
    if [ -n "$chunk" ]; then
        # Check if this is a new dependency
        local isNewDependency=true
        for existingDep in "${allDependencies[@]}"; do
            if [[ $existingDep == "${chunk}.*" ]]; then
                isNewDependency=false
                break
            fi
        done
        
        if $isNewDependency; then
            local chunkPattern="${chunk}.*"
            echo "Found new dependency: $chunk"
            allDependencies+=("$chunkPattern")
            found_new=true
            
            # Copy the new dependency to the temp directory
            find $BUILD_DIR/generated/ -name "${chunk}.*" -exec cp {} $tempdir/generated/ \;
        fi
    fi
    
    $found_new
}

# Extract webpack dependencies recursively
extract_dependencies() {
    local found_new=true
    local iteration=1
    
    echo "Starting dependency extraction..."
    
    while [ "$found_new" = true ]; do
        echo "Iteration $iteration of dependency extraction"
        found_new=false
        
        # Find JS files in the temp directory
        local jsFiles=$(find $tempdir/generated -name "*.js")
        
        for jsFile in $jsFiles; do
            # Get relative path as a unique identifier
            local relPath=$(basename "$jsFile")
            
            # Skip already processed files
            if is_processed "$relPath"; then
                continue
            fi
            
            # Mark file as processed
            processedFiles+=("$relPath")
            
            echo "Analyzing: $relPath"
            
            # Extract dependencies from the file
            local foundChunks=$(extract_deps_from_file "$jsFile")
            
            # Process all found chunks
            for chunk in $foundChunks; do
                if process_chunk "$chunk"; then
                    found_new=true
                fi
            done
        done
        
        ((iteration++))
    done
    
    echo "Dependency extraction complete."
}

# ----- Main Script Begins Here -----

# Exit if app entry names or directories are missing
if [ -z "$ENTRY_NAMES" ] || [ -z "$APP_DIRS" ] || [ -z "$BUILD_DIR" ]; then
    echo "Error: Missing entry names, app directories, or build directory."
    exit 1
fi

# Generate arrays for entry names, chunk ids, and lazy loaded Webpack chunk names.
# Chunk ids follow the convention of the 'named' option that's set in the Webpack config.
entryNames=(${ENTRY_NAMES//,/ })
chunkIds=($(echo ${APP_DIRS//,/ } | tr '/' '_'))
webpackChunkNames=($(grep -r 'webpackChunkName:' ${APP_DIRS//,/ } | grep -o '"[^"]\+"' | tr -d \"))

# Generate array of file patterns to sync
filesToSync=("${entryNames[@]/%/.*}" "${chunkIds[@]/%/*}" "${webpackChunkNames[@]/%/.*}")

if [ -z "$chunkIds" ] || [ -z "$webpackChunkNames" ]; then echo "No lazy loaded app chunks found."; fi
echo "Initial files to sync:" && printf "%s\n" "${filesToSync[@]}" | sort

# Make temp directory for storing filtered app assets
tempdir=$(mktemp -d) && mkdir -p $tempdir/generated

# Copy app assets into temp directory
for filename in ${filesToSync[@]}
do 
    find $BUILD_DIR/generated/ -name "$filename" -exec cp {} $tempdir/generated/ \;
done

# Array to track processed files
processedFiles=()

# Set to track all dependencies including the initial ones
allDependencies=("${filesToSync[@]}")

# Run the recursive dependency extraction
extract_dependencies

# Show final list of dependencies
echo "Final files to sync:" && printf "%s\n" "${allDependencies[@]}" | sort | uniq

# Sync build directory with temp directory and remove global assets
rsync -a --delete --remove-source-files $tempdir/ $BUILD_DIR/

# Clean up
rm -rf $tempdir
