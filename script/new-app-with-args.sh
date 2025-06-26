#!/bin/bash

# Run the yeoman generator with all passed arguments
node ./script/yeoman-generator-with-args.js "$@"

# Check if the generator succeeded
if [ $? -eq 0 ]; then
    # Only run linting if the generator succeeded
    npm run lint:js:untracked:fix
else
    # Exit with the same error code if generator failed
    exit $?
fi
