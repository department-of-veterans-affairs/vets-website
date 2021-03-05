#!/bin/bash

# This script runs the vets-website build script.  The reason it's
# here is so the `set -o pipefail` will work properly; Jenkins gets
# mad when we use it in a sh command.

# Get CLI args
while [[ $# -gt 0 ]]
do
  key="${1}"
  case ${key} in
    --envName)
      envName="${2}"
      shift 2
      ;;
    --assetSource)
      assetSource="${2}"
      shift 2
      ;;
    --drupalAddress)
      drupalAddress="${2}"
      shift 2
      ;;
    --drupalMaxParallelRequests)
      drupalMaxParallelRequests="${2}"
      shift 2
      ;;
    --pull-drupal)
      pullDrupal="${1}"
      shift
      ;;
    --buildLog)
      buildLog="${2}"
      shift 2
      ;;
    --omitdebug)
      omitdebug="${1}"
      shift
      ;;
    *)    # unknown option
      shift # past argument
      ;;
  esac
done

# The pipefail option makes the command return the right-most non-zero
# exit code.  In this case, if the build command fails, the tee
# command won't trick Jenkins into thinking the step passed.
set -o pipefail
npm --no-color run build -- --verbose --buildtype="$envName" --asset-source="$assetSource" --drupal-address="$drupalAddress" --drupal-max-parallel-requests="$drupalMaxParallelRequests" "$omitdebug" "$pullDrupal" 2>&1 | tee "$buildLog"

exit $?
