# get  argument or default to "."
d="${1-.}"

#sanitize input: resolve to ".", "./src", or a path under "./src"
if [ $d != "." ]; then 
    if [ $d == "/" ]; then
        d="./src"
    else 
        d=${d%/}
        d=${d#/}
        d="./src/$d"
    fi
fi
# confirm
echo "Delete folders named 'node_modules' in $d:" 
find ${d} -name "node_modules" -type d -prune
read -p "Are you sure you want to delete the directories listed above (Y/N)? "
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # do delete
    find ${d} -name "node_modules" -type d -prune -exec rm -rf "{}" +
    echo "Deletion complete."
else
    echo "Action Canceled."
fi
