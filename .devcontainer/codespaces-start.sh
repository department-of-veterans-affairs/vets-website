#!/bin/bash

# Start mock services
printf "\n\n##### Starting mock services #####\n"
yarn mock-api --responses src/platform/mhv/api/mocks &


# Start vets-website
printf "\n\n##### Starting vets-website #####\n"
cd ../vets-website && yarn watch --env entry=mhv-secure-messaging,medications api=https://${CODESPACE_NAME}-3000.app.github.dev public=https://${CODESPACE_NAME}-3001.app.github.dev