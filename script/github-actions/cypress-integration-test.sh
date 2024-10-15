#!/bin/bash

integrationHelper() {
  local product="$1"

  local slack_group
  slack_group=$(grep -A 3 "\"rootFolder\": \"$product\"" ./config/changed-apps-build.json | awk -F'"' '/slackGroup/ {print $4}')
  
  if [[ -z "$slack_group" ]]; then
    echo "Warning: no slackGroup found for product '$product'.  Results will be sent to status-vets-website"
    slack_group="<C02V265VCGH>"
    
  fi

  echo "VETS_WEBSITE_CHANNEL_ID=$slack_group" >> $GITHUB_ENV
  echo "INTEGRATION_APP_PATTERN=$app_path" >> $GITHUB_ENV
}

integrationHelper "$1"
