#!/bin/bash

WEB_PORT=3001

# Ensure all running servers are terminated on script exit.
trap 'if [ $(jobs -p) ] ; then kill $(jobs -p); fi' EXIT

yarn watch --env.entry proxy-rewrite --env.local-proxy-rewrite &

# Wait for api server and web server to begin accepting connections
# via http://unix.stackexchange.com/questions/5277
while ! echo exit | nc localhost ${WEB_PORT:-3001}; do sleep 3; done

WEB_PORT=3001 BABEL_ENV=test npm --no-color run nightwatch -- src/applications/proxy-rewrite/redirects.e2e.spec.js
