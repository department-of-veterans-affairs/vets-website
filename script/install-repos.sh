#!/usr/bin/env bash
if [ ! -d ../vagov-content ]; then
  git clone --depth 1 https://github.com/department-of-veterans-affairs/vagov-content.git ../vagov-content
else
  echo "Repo vagov-content already cloned."
fi

# @TODO: if these are not needed anymore, remove.
# git clone git@github.com:department-of-veterans-affairs/vets-json-schema.git
# git clone git@github.com:department-of-veterans-affairs/veteran-facing-services-tools.git
# git clone git@github.com:department-of-veterans-affairs/vets-api.git
# git clone git@github.com:department-of-veterans-affairs/vets-api-mockdata.git
