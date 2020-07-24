/* eslint-disable no-console */

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const BundleSchema = require('./bundleSchema');

const transformersDir = path.resolve(__dirname, '../transformers');

/**
 * Automatically generate files for
 * * input
 * * transfomer
 * * output
 * that transform a drupal node to the output expected by the liquid template.
 * We do that by loading the bundle definition for the template from the openAPI
 * file provided in the CMS export and analyzing the data structure.
 */

class Generator {
  constructor() {
    // Get the name of the bundle we're generating from the CLI
    this.getBundleName();
    if (!this.bundleName) {
      // Can't do anything without a valid bundle name
      process.exit(1);
    }

    // Don't overwrite existing file unles asked to
    const transfomerFile = path.join(transformersDir, `${this.bundleName}.js`);
    if (fs.existsSync(transfomerFile) && !this.cliOptions.force) {
      console.error(
        `${this.bundleName} transformer already exists in ${transfomerFile}.`,
      );
      process.exit(1);
    }
    // Get the fields for the bundle
    this.getFields();
    // Process the fields.
    this.processFields();
    // generate and save the files
    this.genFiles();
  }

  /*
  * Get the info about the fields from the openAPI
  */
  getFields() {
    // Get the schemas for all bundles.
    const bundleSchema = new BundleSchema();
    const bundles = bundleSchema.bundles;

    // schema for our specific bundle
    this.bundle = bundles[this.bundleName];

    // fields for our specific bundle
    this.fields = bundles[this.bundleName].fields;

    // Save the schema of the bundle to a local file so that
    // the developer can look and analyze
    const fileNamepath = `./${this.bundleName}--schema.js`;
    const prettyOutJson = JSON.stringify(this.bundle, null, 2);
    fs.writeFileSync(fileNamepath, prettyOutJson);
    console.log(`Created ${fileNamepath} with the bundle schema`);
  }

  /*
  * Process the fields one by one for the correct output
  * for input and output. 
  * Currently we're not generating specfic field for the actual transfomer files TODO
  */
  processFields() {
    this.genFields = [];
    _.map(this.fields, (value, key) => {
      // the field we're generating
      const genField = {
        inputFieldName: key,
        outputFieldName: _.camelCase(key),
      };
      switch (value.type) {
        case 'integer':
          genField.inputSchema = { $ref: 'GenericNestedNumber' };
          genField.outputSchema = { type: 'string' };
          break;
        case 'boolean':
          genField.inputSchema = { $ref: 'GenericNestedBoolean' };
          genField.outputSchema = { type: 'boolean' };
          break;
        case 'object':
          this.getObjectInfoInput(value, genField);
          this.getObjectInfoOutput(value, genField);
          break;
        case 'array':
          // TODO test
          genField.inputSchema = `{ $ref: 'EntityReferenceArray' }`;
          genField.outputSchema = `{ type: 'array' }`;
          break;
        /*
        // TODO figure this out
        case 'metatag':
          genField.inputSchema = `{ $ref: 'GenericNestedString' }`;
          genField.outputSchema = `{ type: 'string' }`;
          break;
          */
        case 'string': // String is the default
        default:
          genField.inputSchema = { $ref: 'GenericNestedString' };
          genField.outputSchema = { type: 'string' };
          break;
      }

      // TODO should just pass an object to the template instead of strings
      genField.inputSchema = JSON.stringify(genField.inputSchema, null, 2);
      genField.outputSchema = JSON.stringify(genField.outputSchema, null, 2);
      this.genFields.push(genField);
    });
  }

  /**
   * get the information for an object type for input
   * @param {Object} fieldSchema - The schema of the field from openApi
   * @param {Object} generatedField - The field we're generating
   */

  getObjectInfoInput(fieldSchema, generatedField) {
    const genField = generatedField;
    if (!fieldSchema.details) {
      genField.inputSchema = { $ref: 'GenericNestedString' };
      genField.outputSchema = { $ref: 'ProcessedString' };
    } else {
      let objInfo = fieldSchema.details;
      // Sometimes the info is nested in properties.data.
      if (objInfo.properties && objInfo.properties.data) {
        objInfo = objInfo.properties.data;
      }
      let required = objInfo.required;
      if (!required === undefined) {
        required = '';
      }
      const nestedFields = this.getNestedFields(objInfo);
      genField.inputSchema = {
        type: 'array',
        items: {
          properties: nestedFields,
          required: [objInfo.required],
        },
      };
    }
  }

  /**
   * get the information for an object type for output
   * @param {Object} fieldSchema - The schema of the field from openApi
   * @param {Object} genField - The field we're generating
   */

  getObjectInfoOutput(fieldSchema, generatedField) {
    const genField = generatedField;
    if (!fieldSchema.details) {
      genField.outputSchema = {
        type: 'object',
      };
    } else {
      /* When we see this output, it means we should have a ProcessedString
      "details": {
        "type": "object",
        "properties": {
          "value": {
            "type": "string",
            "title": "Text"
          },
          "format": {
            "type": "string",
            "title": "Text format"
          }
        },
        "required": [
          "value"
        ],
			*/
      const objInfo = fieldSchema.details;
      if (objInfo.properties && objInfo.properties.value) {
        // switch (objInfo.properties.value.type) {
        // case 'date':
        /* and this is a field with two dates
            "isReference": false,
            "type": "object",
            "details": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "string",
                  "title": "Start date value",
                  "format": "date"
                },
                "end_value": {
                  "type": "string",
                  "title": "End date value",
                  "format": "date"
                }
              },
              "required": [
                "value",
                "end_value"
              ],
              "title": "Date and time"
            }
            */
        // TODO work in progress. restore the switch statement above
        genField.outputSchema = { $ref: 'ProcessedString' };
      }
    }
  }

  /*
  * For an object that contains multiple fields, let's get the 
  * nested fields
  */
  getNestedFields(details) {
    const result = {};
    _.map(details.properties, (value, key) => {
      result[key] = { type: value.type };
    });
    return result;
  }

  /*
  * Generate the files
  * Process the data and the temaplate for each:
  * * input
  * * transformer
  * * output
  */
  genFiles() {
    const [type, bundle] = this.bundleName.split('-');
    const templateData = {
      fieldData: this.genFields,
      entityBundle: bundle,
      entityType: type,
    };

    console.log('Creating:');
    this.saveFile('inputSchema', templateData, '../schemas/input');
    this.saveFile('transformer', templateData, '../transformers');
    this.saveFile('outputSchema', templateData, '../schemas/output');
  }

  async saveFile(templateName, data, outputDir) {
    // Save the template
    const template = path.resolve(__dirname, `templates/${templateName}`);

    const self = this;
    let rendered = '';
    try {
      rendered = await ejs.renderFile(template, data, {});
    } catch (err) {
      console.error(err);
    }
    const fileNamepath = path.resolve(
      __dirname,
      `${outputDir}/${self.bundleName}.js`,
    );
    fs.writeFileSync(fileNamepath, rendered);
    console.log(`  ${fileNamepath}`);
  }

  /* 
  * Process command line opions and get the bundle name
  */

  getBundleName() {
    // Definitions for command line options
    const optionDefinitions = [
      {
        name: 'bundle',
        alias: 'b',
        type: String,
        description: 'Generate transfomer files for this bundle',
      },
      {
        name: 'force',
        alias: 'f',
        type: Boolean,
        description: 'Force generating files overwriting existing files',
      },
      {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Display help',
      },
    ];

    const options = commandLineArgs(optionDefinitions);

    if (!options.bundle || options.help) {
      console.log(
        commandLineUsage([
          {
            header: 'Generate transfomer for a bundle',
            content:
              'Generte the input, transfomer and output file for the bundle..',
          },
          {
            header: 'Options',
            optionList: optionDefinitions,
          },
        ]),
      );
    }

    this.cliOptions = options;
    this.bundleName = options.bundle;
  }
}

const generator = new Generator();
