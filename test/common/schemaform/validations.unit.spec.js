import { expect } from 'chai';

import {
  transformErrors
} from '../../../src/js/common/schemaform/validation';

describe('Schemaform validations', () => {
  describe('transformErrors', () => {
    it('should transform error into message from uiSchema', () => {
      const errors = [
        {
          name: 'test',
          property: 'instance.field',
          argument: '',
          message: 'Old message'
        }
      ];
      const uiSchema = {
        field: {
          'ui:errorMessages': {
            test: 'New message'
          }
        }
      };

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].message).to.equal(uiSchema.field['ui:errorMessages'].test);
    });
    it('should transform error message into default', () => {
      const errors = [
        {
          name: 'maxLength',
          property: 'instance.field',
          argument: 5,
          message: 'Old message'
        }
      ];
      const uiSchema = {
      };

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].message).to.equal('This field should be less than 5 characters');
    });
    it('should transform required message to field level', () => {
      const errors = [
        {
          name: 'required',
          property: 'instance',
          argument: 'field',
          message: 'Old message'
        }
      ];
      const uiSchema = {
      };

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].property).to.equal('instance.field');
      expect(newErrors[0].message).to.equal('Please provide a response');
    });
  });
});
