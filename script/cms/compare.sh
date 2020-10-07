yarn build:content --pull-drupal
mv build/localhost/ build/graphql-localhost/
yarn build:content --pull-drupal --use-cms-export
mv build/localhost build/cms-export-localhost/
cd build
diff -ur graphql-localhost/ cms-export-localhost/ > cms.diff