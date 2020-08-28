import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import formConfig from '../../../0994/config/form';
import fullSchema from 'vets-json-schema/dist/22-0994-schema.json';

describe('0994 schema tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files.filter(file => file.endsWith('json')).forEach(file => {
    it(`should validate ${file}`, () => {
      const contents = JSON.parse(
        fs.readFileSync(path.join(__dirname, file), 'utf8'),
      );
      const submitData = JSON.parse(
        formConfig.transformForSubmit(formConfig, contents),
      ).educationBenefitsClaim.form;

      const result = v.validate(JSON.parse(submitData), fullSchema);

      if (!result.valid) {
        console.log(`Validation errors found in ${file}`); // eslint-disable-line no-console
        console.log(JSON.stringify(result.errors, null, 2)); // eslint-disable-line no-console
      }
      expect(result.valid).to.be.true;
    });
  });
});
