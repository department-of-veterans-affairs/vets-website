#!/bin/bash

integrationHelper() {
  local product="$1"
  local app_path="src/applications/${product}"

  if [[ ! -d "$app_path" ]]; then
    echo "Error: Directory '${app_path}' does not exist."
    exit 1
  fi

  export INTEGRATION_APP_PATTERN="${app_path}"
  echo "$INTEGRATION_APP_PATTERN"
}

integrationHelper "$1"
