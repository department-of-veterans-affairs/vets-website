#!/usr/bin/env bash

ALL_FILES=$(mktemp)
READ_FILES=$(mktemp)
TEST_ENTITIES_PATH="$(dirname "$0")"/../src/site/stages/build/process-cms-exports/tests/entities

# Build a list of all the files (ls)
ls $TEST_ENTITIES_PATH | sort | uniq > "$ALL_FILES"

# Build a list of all the files that are _read_ (yarn test:unit ~/adhoc/vets-website/src/site/stages/build/process-cms-exports/tests/assemble-entity-tree.unit.spec.js | sed -nE 's/^[. ]*([a-z_]+\..+\.json)$/\1/p')
LOG_USED_ENTITIES=true yarn test:unit "$(dirname "$0")"/../src/site/stages/build/process-cms-exports/tests/assemble-entity-tree.unit.spec.js | sed -nE 's/^[․ ]*([a-z_]+\..+\.json)$/\1/p' | sort | uniq > "$READ_FILES"

# comm the files to get the list of files that are only in ALL_FILES (so they exist, but aren't read)
# https://stackoverflow.com/questions/11165182/difference-between-two-lists-using-bash
UNUSED_FILES=$(comm -23 "$ALL_FILES" "$READ_FILES")

# Run through each file and rm it
for filename in $UNUSED_FILES ; do
    # We still want to keep the index.js even though it's not actually read from readEntity
    if [ "$filename" != "index.js" ] ; then
        rm "$TEST_ENTITIES_PATH/$filename"
    fi
done

echo ""
echo "All files list ("$ALL_FILES") contains $(wc -l "$ALL_FILES") lines"
echo "Read files list ("$READ_FILES") contains $(wc -l "$READ_FILES") lines"
echo "To get a list of all the deleted files, run:"
echo "  comm -23 $ALL_FILES $READ_FILES"
echo ""
echo "Deleted $(wc -w <<< "$UNUSED_FILES") unused test JSON files."
echo "Run yarn test:unit ./src/site/stages/build/process-cms-exports/tests/assemble-entity-tree.unit.spec.js to ensure it still works."
