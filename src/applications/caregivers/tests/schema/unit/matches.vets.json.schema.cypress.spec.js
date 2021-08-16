import { expect } from 'chai';
import { Validator } from 'jsonschema';

import { submitTransform } from '../../../helpers';
import formConfig from '../../../config/form';
import caregiversSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import defaultSample from './sample-data/simple.form.data.json';
import missingSample from './sample-data/missing.form.data.json';
import extraSample from './sample-data/extra.form.data.json';

describe('10-10CG - schema tests', () => {
  const validator = new Validator();
  describe('transform for submit', () => {
    it('validates with expected data', () => {
      const form = defaultSample;
      const submitData = submitTransform(formConfig, form);
      const data = JSON.parse(
        JSON.parse(submitData).caregiversAssistanceClaim.form,
      );

      const result = validator.validate(data, caregiversSchema);
      expect(result.valid).to.be.true;
    });
    it('should not validates with missing data', () => {
      const form = missingSample;
      const submitData = submitTransform(formConfig, form);
      const data = JSON.parse(
        JSON.parse(submitData).caregiversAssistanceClaim.form,
      );

      const result = validator.validate(data, caregiversSchema);

      expect(result.valid).to.be.false;
    });
    it('should not validates with extra veteran property', () => {
      const form = extraSample;
      const submitData = submitTransform(formConfig, form);
      const data = JSON.parse(
        JSON.parse(submitData).caregiversAssistanceClaim.form,
      );

      const result = validator.validate(data, caregiversSchema);

      expect(result.valid).to.be.false;
    });
  });
});
