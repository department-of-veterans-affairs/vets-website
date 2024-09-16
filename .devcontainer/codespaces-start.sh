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
    sleep 10

    # Make frontend port public
    printf "\n\n##### Making frontend port public #####\n"
    gh codespace ports visibility 3001:public

    # Make mock API port public
    printf "\n\n##### Making mock API port public #####\n"
    gh codespace ports visibility 3000:public

    API_URL="https://${CODESPACE_NAME}-3000.app.github.dev"
    FRONTEND_URL="https://${CODESPACE_NAME}-3001.app.github.dev"

    printf "\n\n##### Setup complete. Your servers are running and ports are public. #####\n"
    printf "Mock API: $API_URL\n"
    printf "Frontend: $FRONTEND_URL\n"
    printf "Mock Responses: $MOCK_RESPONSES\n"
    if [ -n "$ENTRY_APPS" ]; then
        printf "Entry Apps: $ENTRY_APPS\n"
    else
        printf "Entry Apps: Not specified (using default)\n"
    fi
else
    printf "\n\n##### MAKE_APP_PUBLIC is not set to 'YES'. Servers will not be started. #####\n"
    printf "To make the app public and start the servers, set the MAKE_APP_PUBLIC secret to 'YES' in your Codespace settings.\n"
fi