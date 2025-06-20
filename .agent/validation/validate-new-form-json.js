const fs = require('fs');
const Ajv = require('ajv');

const ajv = new Ajv();

const schema = JSON.parse(fs.readFileSync('.agent/validation/new-form-schema.json', 'utf8'));
const dataFilePath = '.agent/tmp/new_form.json';
if (!fs.existsSync(dataFilePath)) {
  throw new Error(`File not found: ${dataFilePath}`);
}
const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Compile and validate
const validate = ajv.compile(schema);
const valid = validate(data);

if (valid) {
  console.log('Valid JSON!');
} else {
  console.error('Validation errors:', validate.errors);
}