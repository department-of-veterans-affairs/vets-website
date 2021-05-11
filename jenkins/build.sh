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
npm --no-color run build -- --verbose --scaffold --buildtype="$envName" "$omitdebug" 2>&1 | tee "$buildLog"

exit $?
