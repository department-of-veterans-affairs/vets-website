const fs = require('fs-extra');
const Conf = require('./config');
const _ = require('lodash');

const conf = new Conf();
/**
 * Parse the openAPI document and generate from it a list of bundles
 * and for each bundles the list of fields.
 * That should help us when generating new transformers
 */

const ignoredBundleTypes = [
  'consumer',
  'crop',
  'entity_subqueue',
  'file',
  'menu_link_content',
  'oauth2_token',
  'path_alias',
  'redirect',
  'section_association',
  'site_alert',
];

class BundleSchema {
  constructor() {
    this.bundles = {};
    const schema = fs.readJsonSync(conf.cmsExportSchema);
    this.schema = schema.definitions;
    this.loadBundles();
    const originalName = `${conf.cacheDir}/drupal/originalOpenApiSchema.json`;
    fs.outputFileSync(originalName, JSON.stringify(schema, null, 2));
    /* eslint-disable no-console */
    console.log(`Saved original openAPI schema to  ${originalName}`);
    const prettyOutJson = JSON.stringify(this.bundles, null, 2);
    const fileName = `${conf.cacheDir}/drupal/openApiBundleSchema.json`;
    fs.writeFileSync(fileName, prettyOutJson);
    /* eslint-disable no-console */
    console.log(`Saved to ${fileName}`);
  }

  /**
   * load the openAPI exported json file and save the part we're interested in, the bundles
   * info into a file fullSchema.json
   */
  saveSchema() {
    const prettyOutJson = JSON.stringify(this.schema, null, 2);
    fs.writeFileSync('fullSchema.json', prettyOutJson);
  }

  /**
   * Find the names of the bundles in the schema
   * info into a file schema.json
   */
  loadBundles() {
    let ii = 0;
    _.map(this.schema, (value, key) => {
      const strs = key.split('--');
      const bundleType = strs[0];
      const bundle = strs[1];
      // This is the convention for the bundle name
      const bundleName = `${bundleType}-${bundle}`;

      if (ignoredBundleTypes.includes(bundleType)) return;
      this.loadFields(bundleName, value);
      ii++;
    });
    /* eslint-disable no-console */
    console.log(`Found ${ii} bundles`);
  }

  loadFields(name, bundleSchema) {
    const fieldObj = {};

    // Get the fields in this bundle
    const fields =
      bundleSchema.properties.data.properties.attributes.properties;
    _.map(fields, (value, key) => {
      if (key.startsWith('field_')) {
        fieldObj[key] = {
          type: value.type,
        };
      }
    });

    const relationships =
      bundleSchema.properties.data.properties.relationships.properties;
    _.map(relationships, (value, key) => {
      if (key.startsWith('field_')) {
        fieldObj[key] = value;
      }
    });
    // Get the references in this bundle
    this.bundles[name] = {
      fields: fieldObj,
    };
  }
}

// const bundleSchema = new BundleSchema();
BundleSchema();
