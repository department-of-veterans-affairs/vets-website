#!/bin/bash

# Temporary check due to master -> main branch switch. Remove after 2022
if [[ `git rev-parse --abbrev-ref origin/HEAD` != 'origin/main' ]]; then
  echo "ERROR: The vets-website default branch has changed from 'master' to 'main'."
  echo "Please run the following commands to make the switch locally:"
  echo "  git branch -m master main"
  echo "  git fetch origin"
  echo "  git branch -u origin/main main"
  echo "  git remote set-head origin -a"
  exit 1
fi
# End temporary check

if [[ ! `git log origin/main.. --no-merges` ]]; then
  echo "No commits to push! Add at least one commit to push this branch to origin."
  exit 1
fi
