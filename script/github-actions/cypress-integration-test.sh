#!/bin/bash

integrationHelper() {
  local product="$1"
  local app_path="src/applications/${product}"

  if [[ ! -d "$app_path" ]]; then
    echo "Error: Directory '${app_path}' does not exist."
    exit 1
  fi

  export INTEGRATION_APP_PATTERN="${app_path}"

  local slack_group
  slack_group=$(jq -r --arg product "$product" '.apps[] | select(.rootFolder == $product) | .slackGroup' ./config/changed-apps-build.json)
  
  if [[ -z "$slack_group" ]]; then
    echo "Error: no slackGroup found for product '$product'"
    exit 1

  export SLACK_GROUP="$slack_group"

  echo "SLACK_GROUP=$SLACK_GROUP" >> $GITHUB_ENV
  echo "INTEGRATION_APP_PATTERN=$INTEGRATION_APP_PATTERN" >> $GITHUB_ENV
}

integrationHelper "$1"
