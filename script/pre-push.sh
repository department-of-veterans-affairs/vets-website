#!/bin/bash

if [[ ! `git log origin/main.. --no-merges` ]]; then
  echo "No commits to push! Add at least one commit to push this branch to origin."
  exit 1
fi
