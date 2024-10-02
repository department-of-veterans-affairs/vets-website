#!/bin/bash

if [[ "${VETS_WEBSITE_MHV_MOCK_SERVICE}" == "YES" ]]
then
    # Start mock services
    printf "\n\n##### Starting MHV mock services #####\n"
    yarn mock-api --responses src/platform/mhv/api/mocks &

    # Start vets-website
    printf "\n\n##### Starting vets-website #####\n"
    cd ../vets-website && yarn watch --env api=https://${CODESPACE_NAME}-3000.app.github.dev public=https://${CODESPACE_NAME}-3001.app.github.dev
fi


# script to start the mock API server and vets-website if MAKE_APP_PUBLIC is set to 'YES'

# Set default values
MOCK_RESPONSES=${MOCK_RESPONSES:-src/platform/testing/local-dev-mock-api/common.js}

# Get the display name of the Codespace
DISPLAY_NAME=$(gh codespace view --json displayName -q .displayName)

printf "\n\n##### Display name: $DISPLAY_NAME #####\n"

# Check if the display name starts with "va-public-"
if [[ "$DISPLAY_NAME" == va-public-* ]]; then
    MAKE_APP_PUBLIC="YES"
    printf "\n\n##### Codespace display name starts with 'va-public-'. Setting up public environment. #####\n"
else
    MAKE_APP_PUBLIC="NO"
    printf "\n\n##### Codespace display name does not start with 'va-public-'. Setting up private environment. #####\n"
fi

if [ "$MAKE_APP_PUBLIC" == "YES" ]; then
    # Start mock API server
    printf "\n\n##### Starting mock API server #####\n"
    yarn mock-api --responses "$MOCK_RESPONSES" &

    # Start vets-website
    printf "\n\n##### Starting vets-website #####\n"
    if [ -n "$ENTRY_APPS" ]; then
        yarn watch --env entry="$ENTRY_APPS" api=https://${CODESPACE_NAME}-3000.app.github.dev &
    else
        yarn watch --env api=https://${CODESPACE_NAME}-3000.app.github.dev &
    fi

    # Wait for servers to start
    printf "\n\n##### Waiting 20 seconds for servers to start... #####\n"
    sleep 20

    # Make frontend port public
    printf "\n\n##### Making frontend port public #####\n"
    gh codespace ports visibility 3001:public -c "$CODESPACE_NAME"

    # Make mock API port public
    printf "\n\n##### Making mock API port public #####\n"
    gh codespace ports visibility 3000:public -c "$CODESPACE_NAME"

    printf "\n\n##### Setup complete. Your servers are running and ports are public. #####\n"
    wait
else
    printf "\n\n##### Codespace is not set to run on a public port. #####\n"
    printf "To make the app public and start the servers, change the Codespace 'friendly name' to start with va-public-\n"
fi