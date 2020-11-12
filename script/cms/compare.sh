rm -rf build
rm -rf .cache
yarn build:content --pull-drupal
mv build/localhost/ build/graphql-localhost/
yarn build:content --use-cms-export --pull-drupal
mv build/localhost build/cms-export-localhost/
cd build
diff -ur graphql-localhost/ cms-export-localhost/ > cms.diff