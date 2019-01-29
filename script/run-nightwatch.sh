#!/bin/bash

SAUCE=false
VISUAL_REGRESSION_TESTING=false

for i in "$@"
do
case $i in
  --sauce)
      SAUCE=true
      shift # past argument=value
      ;;
  --visual)
      VISUAL_REGRESSION_TESTING=true
      shift
      ;;
  *)
      # unknown option
      ;;
esac
done

# Harness for running end to end tests. The end to end test framework requires
# a mock API server as well as a webserver with the content to provide
# endpoints that selenium can run against.

# Ensure all running servers are terminated on script exit.
trap 'if [ $(jobs -p) ] ; then kill $(jobs -p); fi' EXIT

BUILDTYPE=${BUILDTYPE:-vagovdev}

"$(dirname "$0")"/run-mockapi.sh

# Check to see if we already have a server running on port 3001 (as with 'npm run build')
 if [ "$(nc -z localhost 3001; echo $?)" -ne 0 ]; then
  echo "Starting test-server.js..."
  node src/platform/testing/e2e/test-server.js --buildtype ${BUILDTYPE} &
else
  echo "Using webpack-dev-server as test server on port 3001"
  export WEB_PORT=3001
fi


# Wait for api server and web server to begin accepting connections
# via http://unix.stackexchange.com/questions/5277
while ! echo exit | nc localhost ${API_PORT:-3000}; do sleep 3; done
while ! echo exit | nc localhost ${WEB_PORT:-3333}; do sleep 3; done

# Webpack dev server blocks when attempting to read a generated file
# until it is ready so executing a curl command for such a file ensures
# the server is started before continuing.
#
# Do this after the nc localhost 3001 wait to ensure the server is up
# otherwise curl may race the server start and not actually block.
#curl http://localhost:3001/generated/hca.entry.js > /dev/null 2>&1

# Execute the actual tests.
if [ $SAUCE == true ]; then
  BABEL_ENV=test npm --no-color run nightwatch-sauce -- "${@}"
elif [ $VISUAL_REGRESSION_TESTING = true ]; then
  BABEL_ENV=test npm --no-color run nightwatch-visual -- "${@}"
else
  BABEL_ENV=test npm --no-color run nightwatch -- "${@}"
fi
