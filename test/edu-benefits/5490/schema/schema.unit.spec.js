import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import { transform } from '../../../../src/js/edu-benefits/5490/helpers';
import formConfig from '../../../../src/js/edu-benefits/5490/config/form';
import fullSchema5490 from 'vets-json-schema/dist/dependents-benefits-schema.json';

describe.only('5490 schema tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files
    .filter(file => file.endsWith('json'))
    .forEach((file) => {
      it(`should validate ${file}`, () => {
        const contents = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
        const submitData = JSON.parse(transform(formConfig, contents)).educationBenefitsClaim.form;
        const result = v.validate(
          JSON.parse(submitData),
          fullSchema5490
        );

        if (!result.valid) {
          console.log(result.errors); // eslint-disable-line
        }
        expect(result.valid).to.be.true;
      });
    });
});
