#!/bin/bash

# Ensure all running servers are terminated on script exit.
trap 'jobs -p; if [ $? -eq 0 ] ; then kill $(jobs -p); fi' EXIT

# Fire up the mock api server
"$(dirname "$0")"/run-mockapi.sh

# Fire up the test
export WEB_PORT=3001
"$(dirname "$0")"/../node_modules/.bin/jest -c=config/jest-puppeteer.config.js "${@}"
