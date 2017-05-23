import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import { transform } from '../../../src/js/hca-rjsf/helpers';
import formConfig from '../../../src/js/hca-rjsf/config/form';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

describe('hca schema tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files
    .filter(file => file.endsWith('json'))
    .forEach((file) => {
      it(`should validate ${file}`, () => {
        const contents = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
        const submitData = JSON.parse(transform(formConfig, contents)).form;
        const result = v.validate(
          JSON.parse(submitData),
          fullSchemaHca
        );
        if (!result.valid) {
          console.log(result.errors); // eslint-disable-line
        }
        expect(result.valid).to.be.true;
      });
    });
});
