#!/bin/sh

# Installs private Deque Attest modules and associated rules to test/util/attest-deps.
# After installation, these files are used as the source for running the nightwatch
# accessibility tests in `npm run test:accessibility`.
#
# Rationale
# ---
# Deque Attest is provided from a private module index, and cannot be installed side
# by side with the application source without a private repo manager like Nexus. To minimize
# the number of requirements and avoid hosting a separate service, these packages are
# installed into a subdirectory and loaded from source when required. It's expected that
# this process will generally be run only by developers performing accessibility updates
# and by the continuous integration server.
#
# Usage
# ---
# Find an ATTEST_USERNAME and ATTEST_API_KEY by contacting James Kassemi or Courtney
# Eimerman-Wallace. These values are encrypted and provided in .travis.yml when running
# with the CI. Run the attest bootstrap to attest module and rules:
#
#   $ ATTEST_USERNAME=you@example.com ATTEST_API_KEY=X npm run attest:bootstrap
#
# Now that the dependencies are in place, you can run the accessibility tests:
#
#   $ npm run build && npm run test:accessibility

set -evu

ATTEST_DEFAULT_SCOPE=attest
ATTEST_VA_SCOPE=attest_va
ATTEST_REGISTRY_AUTH_URL=https://agora.dequecloud.com/artifactory/api/npm/attest/auth/$ATTEST_DEFAULT_SCOPE/
ATTEST_REGISTRY_VA_AUTH_URL=https://agora.dequecloud.com/artifactory/api/npm/va.gov/auth/$ATTEST_VA_SCOPE/
ATTEST_REGISTRY_URL=https://agora.dequecloud.com/artifactory/api/npm/attest/
ATTEST_REGISTRY_VA_URL=https://agora.dequecloud.com/artifactory/api/npm/va.gov/

curl -v -u"$ATTEST_USERNAME:$ATTEST_API_KEY" $ATTEST_REGISTRY_AUTH_URL > ~/.npmrc
curl -v -u"$ATTEST_USERNAME:$ATTEST_API_KEY" $ATTEST_REGISTRY_VA_AUTH_URL >> ~/.npmrc

echo "" > npm-install.log

mkdir -p test/util/attest-deps
cd test/util/attest-deps

npm init -y

npm install \
  --save-dev attest-rules \
  --registry $ATTEST_REGISTRY_VA_URL >> npm-install.log 2>&1

npm install \
  --save-dev attest \
  --registry $ATTEST_REGISTRY_URL >> npm-install.log 2>&1

npm install --loglevel verbose \
  --save-dev attest-node attest-webdriverjs \
  --registry $ATTEST_REGISTRY_URL >> npm-install.log 2>&1
