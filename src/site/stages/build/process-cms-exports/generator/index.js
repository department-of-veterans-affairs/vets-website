const Generator = require('yeoman-generator');
const fuzzy = require('fuzzy');

const customRefs = [
  `{ $ref: 'GenericNestedString' }`,
  `{ $ref: 'GenericNestedBoolean' }`,
  `{ $ref: 'GenericNestedNumber' }`,
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

const schemaOptions = schemaTypes.concat(customRefs);

const getFieldType = async (answers, input = '') =>
  fuzzy.filter(input, schemaOptions).map(el => el.original);

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.env.adapter.promptModule.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
  }
  async getBundleData() {
    this.log('Hello, world!');
    this.prompt([
      {
        type: 'autocomplete',
        name: 'fieldType',
        suggestOnly: true,
        message: 'Field type',
        source: getFieldType,
      },
    ]);
  }

  generateInputSchema() {}

  generateOutputSchema() {}

  generateTransformer() {}

  writeFiles() {}
};
