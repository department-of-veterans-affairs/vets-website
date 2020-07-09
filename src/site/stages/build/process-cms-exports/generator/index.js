const path = require('path');
const fs = require('fs');
const Generator = require('yeoman-generator');
const fuzzy = require('fuzzy');

const transformersDir = path.resolve(__dirname, '../transformers');

const customRefs = [
  `{ $ref: 'GenericNestedString' }`,
  `{ $ref: 'GenericNestedBoolean' }`,
  `{ $ref: 'GenericNestedNumber' }`,
  `{ $ref: 'EntityReferenceArray' }`,
  `{ $ref: 'RawMetaTag' }`, // Used in the input schema
  `{ $ref: 'MetaTag' }`, // Used in the output schema
];

const schemaTypes = [
  `{ type: 'string' }`,
  `{ type: 'object', properties: {} }`,
  `{ type: 'array' }`,
  `{ type: 'number' }`,
  `{ type: 'boolean' }`,
];

const schemaOptions = customRefs.concat(schemaTypes);

const getFieldType = async (answers, input = '') =>
  fuzzy.filter(input, schemaOptions).map(el => el.original);

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.env.adapter.promptModule.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
    this.bundleName = '';
    this.inputFields = [];
  }

  async getBundleData() {
    const { bundleName } = await this.prompt([
      {
        type: 'input',
        name: 'bundleName',
        message: "What's the full name of the bundle? (e.g. paragraph-q_a)",
        validate: input =>
          !fs.existsSync(path.join(transformersDir, `${input}.js`)) ||
          `${input} transformer already exists.`,
      },
    ]);
    this.bundleName = bundleName;
  }

  async generateInputSchema() {
    let addAnother;
    do {
      // eslint-disable-next-line no-await-in-loop
      const fieldData = await this.prompt([
        {
          type: 'input',
          name: 'fieldName',
          message: "What's the name of the field in the input?",
        },
        {
          type: 'autocomplete',
          name: 'inputSchema',
          suggestOnly: true,
          message: 'What does the input schema look like?',
          source: getFieldType,
        },
      ]);
      // eslint-disable-next-line no-await-in-loop
      addAnother = await this.prompt([
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'Add another field?',
        },
      ]).addAnother;
      this.inputFields.push(fieldData);
    } while (addAnother);
  }

  generateOutputSchema() {}

  generateTransformer() {}

  writeFiles() {}
};
