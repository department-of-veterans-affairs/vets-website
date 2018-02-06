#!/bin/bash

node src/test-support/test-server.js --buildtype=production --host=0.0.0.0 --port=3001 &
node src/test-support/mockapi.js --host=0.0.0.0 --port=3000 &

wait
