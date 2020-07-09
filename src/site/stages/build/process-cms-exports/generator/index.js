const Generator = require('yeoman-generator');
const fuzzy = require('fuzzy');

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
  }

  async getBundleData() {
    // this.prompt([
    // ]);
    const inputFields = [];
    let answers = {};
    do {
      // eslint-disable-next-line no-await-in-loop
      answers = await this.prompt([
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
        {
          type: 'confirm',
          name: 'another',
          message: 'Add another field?',
        },
      ]);
      inputFields.push({
        fieldName: answers.fieldName,
        inputSchema: answers.inputSchema,
      });
    } while (answers.another);
    this.log(inputFields);
  }

  generateInputSchema() {}

  generateOutputSchema() {}

  generateTransformer() {}

  writeFiles() {}
};
