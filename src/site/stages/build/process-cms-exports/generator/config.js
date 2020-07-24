const path = require('path');

/**
 * Configuration file to indicate where to find the different artifcats of the transfomer
 */
class Conf {
  constructor() {
    // The cashe dir where the build stores files
    this.cacheDir = path.resolve(
      __dirname,
      `../../../../../../.cache/localhost/`,
    );
    // The directory for the nodes that the tome sync created in the tar file
    this.cmsExportDir = path.resolve(
      __dirname,
      `${this.cacheDir}/cms-export-content`,
    );
    // The open API schema of Drupal
    this.cmsExportSchema = path.resolve(
      __dirname,
      `${this.cmsExportDir}/meta/schema.json`,
    );
    // The graphQL file created by the graphQL query
    this.graphqlFile = path.resolve(
      __dirname,
      `${this.cacheDir}/drupal/pages.json`,
    );
    // Where to store the nodes from the ${graphQL} file
    this.nodeFileDir = path.resolve(__dirname, `${this.cacheDir}/drupal/nodes`);
    this.transformerDir = path.resolve(
      __dirname,
      '../../src/site/stages/build/process-cms-exports/transformers',
    );
  }
}

module.exports = Conf;
