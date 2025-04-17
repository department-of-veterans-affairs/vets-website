import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import fullSchema10203 from 'vets-json-schema/dist/22-10203-schema.json';
import formConfig from '../../config/form';

describe('10203 schema tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files
    .filter(file => file.endsWith('json'))
    .forEach(file => {
      it(`should validate ${file}`, () => {
        const contents = JSON.parse(
          fs.readFileSync(path.join(__dirname, file), 'utf8'),
        );
        const submitData = JSON.parse(
          formConfig.transformForSubmit(formConfig, contents),
        ).educationBenefitsClaim.form;
        const result = v.validate(JSON.parse(submitData), fullSchema10203);

        if (!result.valid) {
          console.log(result.errors); // eslint-disable-line no-console
        }
        expect(result.valid).to.be.true;
      });
    });
});
