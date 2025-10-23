#!/usr/bin/env bash
if [ ! -d ../vagov-content ]; then
  git clone --single-branch --depth 1 https://github.com/department-of-veterans-affairs/vagov-content.git ../vagov-content
else
  echo "Repo vagov-content already cloned."
fi

if [ ! -d ../content-build ]; then
  git clone --single-branch --depth 1 https://github.com/department-of-veterans-affairs/content-build.git ../content-build
else
  echo "Repo content-build already cloned."
fi

if [ ! -d ../vets-api ]; then
  git clone --single-branch --depth 1 https://github.com/department-of-veterans-affairs/vets-api.git ../vets-api
else
  echo "Repo vets-api already cloned."
fi
