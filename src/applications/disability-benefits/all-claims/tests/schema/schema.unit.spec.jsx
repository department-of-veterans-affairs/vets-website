import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { Validator } from 'jsonschema';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import formConfig from '../../config/form';

describe('526 all claims schema tests', () => {
  const v = new Validator();
  const dataDirPath = path.join(__dirname, '../fixtures/data/');
  const files = fs.readdirSync(dataDirPath);
  files.filter(file => file.endsWith('json')).forEach(file => {
    it(`should validate ${file}`, () => {
      const contents = JSON.parse(
        fs.readFileSync(path.join(dataDirPath, file), 'utf8'),
      );
      if (file.includes('-bdd-')) {
        // "to" date is missing & is calculated dynamically in e2e tests
        contents.data.serviceInformation.servicePeriods[1].dateRange.to =
          '2020-01-01';
      }
      const submitData = JSON.parse(
        formConfig.transformForSubmit(formConfig, contents),
      );
      const result = v.validate(submitData.form526, fullSchema);

      if (!result.valid) {
        console.log(`Validation errors found in ${file}`); // eslint-disable-line no-console
        console.log(JSON.stringify(result.errors, null, 2)); // eslint-disable-line no-console
      }
      expect(result.valid).to.be.true;
    });
  });
});
