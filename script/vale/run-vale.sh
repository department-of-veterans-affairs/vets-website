#!/usr/bin/env bash

# TODO verify the bin/vale exists else abort
# TODO add error handling
echo $1
vale --output=CLI --no-exit --config="script/vale/.vale.ini" $1

# To run from the CLI while testing:
# cat script/vale/TEST.md | vale --config="script/vale/.vale.ini" | xargs -0
