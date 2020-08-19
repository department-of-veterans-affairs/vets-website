const path = require('path');

/**
 * Configuration file to indicate where to find the different artifacts of the transformer
 */
function Conf() {
  this.transformerDir = path.resolve(
    __dirname,
    '../../src/site/stages/build/process-cms-exports/transformers',
  );
  // The cache dir where the build stores files
  this.cacheDir = path.resolve(__dirname, `../../.cache/localhost/`);
  // The directory for the nodes that the tome sync created in the tar file
  this.cmsExportDir = path.join(this.cacheDir, 'cms-export-content');
  // The open API schema of Drupal
  this.cmsExportSchema = path.join(this.cmsExportDir, '/meta/schema.json');
  // GraphQL variables
  // The graphQL file created by the graphQL query
  this.graphqlFile = path.join(this.cacheDir, '/drupal/pages.json');
  // Where to store the nodes from the transformed file
  this.nodeFileDir = path.join(this.cacheDir, '/drupal/nodes');
  // Transformer variables
  // The graphQL file created by the transformer output schemas
  this.transformedFile = path.join(
    this.cacheDir,
    '/drupal/pagesTransformed.json',
  );
  // Where to store the nodes from the transformed file
  this.nodeTransformedFileDir = path.join(
    this.cacheDir,
    '/drupal/nodesTransformed',
  );
}

module.exports = Conf;
