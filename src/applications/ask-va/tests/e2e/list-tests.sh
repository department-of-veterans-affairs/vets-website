#!/bin/bash

echo "{"
echo "    \"unauthenticated\": ["

LAST_FILE=""
for file in flows/unauthenticated/*.yml; do
  if [ ! -z $LAST_FILE ]
    then
        fileonly=$(basename $LAST_FILE)
        echo "        \"$fileonly\","
    fi
    LAST_FILE=$file
done
if [ ! -z $LAST_FILE ] && [ "$(basename $LAST_FILE)" != "*.yml" ]; then
    fileonly=$(basename $LAST_FILE)
    echo "        \"$fileonly\""
fi

echo "    ],"
echo "    \"authenticated\": ["

LAST_FILE=""
for file in flows/authenticated/*.yml; do
  if [ ! -z $LAST_FILE ]
    then
        fileonly=$(basename $LAST_FILE)
        echo "        \"$fileonly\","
    fi
    LAST_FILE=$file
done
if [ ! -z $LAST_FILE ] && [ "$(basename $LAST_FILE)" != "*.yml" ]; then
    fileonly=$(basename $LAST_FILE)
    echo "        \"$fileonly\""
fi

echo "    ]"
echo "}"
