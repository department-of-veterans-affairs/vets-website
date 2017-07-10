import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import { transform } from '../../../src/js/pensions/helpers';
import formConfig from '../../../src/js/pensions/config/form';
import fullSchema527ez from 'vets-json-schema/dist/21P-527EZ-schema.json';

describe('527ez schema tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files
    .filter(file => file.endsWith('json'))
    .forEach((file) => {
      const contents = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
      const submitData = JSON.parse(transform(formConfig, contents)).pensionClaim.form;
      // console.log('submitData:', JSON.stringify(JSON.parse(submitData), null, 2));
      it(`should validate ${file}`, () => {
        const result = v.validate(
          JSON.parse(submitData),
          fullSchema527ez
        );

        if (!result.valid) {
          console.log(result.errors.map(e => e.message)); // eslint-disable-line
        }
        expect(result.valid).to.be.true;
      });
    });
});
