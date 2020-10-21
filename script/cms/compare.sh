yarn build:content --pull-drupal
rm -rf build/graphql-localhost/
mv build/localhost/ build/graphql-localhost/
yarn build:content --use-cms-export
rm -rf build/cms-export-localhost/
mv build/localhost build/cms-export-localhost/
cd build
diff -ur graphql-localhost/ cms-export-localhost/ > cms.diff