if [ $# -eq 0 ]; then
    echo "Please provide an entity id"
    exit 1
fi

echo "Searching for node with entity id $1..."

find .cache/localhost/cms-export-content -name "*.json" \
| xargs jq "select(.nid[0].value == $1) | input_filename" \
| xargs less