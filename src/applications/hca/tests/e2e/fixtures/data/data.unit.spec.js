import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { Validator } from 'jsonschema';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import { transform } from '../../../../utils/helpers';
import formConfig from '../../../../config/form';

describe('hca data tests', () => {
  const v = new Validator();
  const files = fs.readdirSync(__dirname);
  files.filter(file => file.endsWith('json')).forEach(file => {
    it.skip(`should validate ${file}`, () => {
      const contents = JSON.parse(
        fs.readFileSync(path.join(__dirname, file), 'utf8'),
      );
      const submitData = JSON.parse(transform(formConfig, contents)).form;
      const data = JSON.parse(submitData);
      const result = v.validate(data, fullSchemaHca);
      if (!result.valid) {
        console.log(result.errors); // eslint-disable-line no-console
      }
      expect(typeof data.dependents).not.to.equal('undefined');
      expect(result.valid).to.be.true;
    });
  });
});
