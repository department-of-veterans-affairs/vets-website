#!/bin/bash

# Start mock services
printf "\n\n##### Starting mock services #####\n"
yarn mock-api --responses src/applications/mhv-secure-messaging/api/mocks &


# Start vets-website
printf "\n\n##### Starting vets-website #####\n"
cd ../vets-website && yarn watch --env entry=mhv-secure-messaging