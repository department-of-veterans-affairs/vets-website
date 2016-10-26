#!/bin/bash

# Harness for running end to end tests. The end to end test framework requires
# a mock API server as well as a webserver with the content to provide
# endpoints that selenium can run against.

# Ensure all running servers are terminated on script exit.
trap 'kill $(jobs -p)' EXIT

BUILDTYPE=${BUILDTYPE:-development}

# Run the api server and the webserver.
node src/test-support/mockapi.js &
npm run serve &

# Wait for api server and web server to begin accepting connections
# via http://unix.stackexchange.com/questions/5277
while ! echo exit | nc localhost 4000; do sleep 1; done
while ! echo exit | nc localhost 3001; do sleep 1; done

# Webpack dev server blocks when attempting to read a generated file
# until it is ready so executing a curl command for such a file ensures
# the server is started before continuing.
#
# Do this after the nc localhost 3001 wait to ensure the server is up
# otherwise curl may race the server start and not actually block.
#curl http://localhost:3001/generated/hca.entry.js > /dev/null 2>&1

# Execute the actual tests.
npm run nightwatch -- "${@}"
