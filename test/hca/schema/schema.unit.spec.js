import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import { transform } from '../../../src/js/hca/helpers';
import formConfig from '../../../src/js/hca/config/form';
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
        const data = JSON.parse(submitData);
        const result = v.validate(
          data,
          fullSchemaHca
        );
        if (!result.valid) {
          console.log(result.errors); // eslint-disable-line
        }
        if (data.veteranAddress.country === 'USA') {
          expect(data.veteranAddress.zipcode).to.not.be.empty;
          expect(typeof data.veteranAddress.postalCode).to.equal('undefined');
        }
        if (data.veteranAddress.country !== 'USA') {
          expect(data.veteranAddress.postalCode).to.not.be.empty;
          expect(typeof data.veteranAddress.zipcode).to.equal('undefined');
        }
        if (data.spouseAddress && data.spouseAddress.country === 'USA') {
          expect(data.spouseAddress.zipcode).to.not.be.empty;
          expect(typeof data.spouseAddress.postalCode).to.equal('undefined');
        }
        expect(typeof data.children).not.to.equal('undefined');
        expect(result.valid).to.be.true;
      });
    });
});
