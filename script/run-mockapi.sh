#!/bin/bash

# Ensure all running servers are terminated on script exit.
trap 'if [ $(jobs -p) ] ; then kill $(jobs -p); fi' EXIT

# Check to see if we already have an API server running on port 3000
if [ "$(nc -z localhost 3000; echo $?)" -ne 0 ]; then
    echo "Starting mockapi.js..."
    node src/platform/testing/e2e/mockapi.js &
    # waits for process to stop
    wait;
else
    # echo "Error: Port 3000 is already in use.  If you're sure that's OK, tests will continue in 5 seconds..."
    echo "Port 3000 is already in use."
    # sleep 5;
fi
