# Setup

* Run yarn install to make sure you have the packages
* Make sure that * ../../.cache/localhost/cms-export-content is populated with data from the tome sync/tar export or pass it as a command line param, -- export-dir
* make sure you have bundles.json in ../../../bundles.json or pass it as an arc -- schema
* make sure you have the graphql output in ../../.cache/localhost/drupal/pages.json

# run
Run setup.sh
* It will take the nodes from pages.json and put them one in a file in graphqlout
* It will then look up the list of these nodes and find them in the cms export and process each node using the field transformation


