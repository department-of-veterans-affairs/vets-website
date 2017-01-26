import { expect } from 'chai';
import sinon from 'sinon';

import {
  transformErrors,
  uiSchemaValidate
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
  describe('uiSchemaValidate', () => {
    it('should use custom validation with function validator', () => {
      const errors = {};
      const validator = sinon.spy();
      const uiSchema = {
        'ui:validations': [
          validator
        ],
        'ui:errorMessages': {}
      };
      const formData = {};
      const formContext = {};

      uiSchemaValidate(errors, uiSchema, formData, formContext);

      expect(errors.__errors).to.be.defined;
      expect(errors.addError).to.be.function;
      expect(validator.calledWith(errors, formData, formData, formContext, uiSchema['ui:errorMessages'])).to.be.true;
    });
    it('should use custom validation with object validator', () => {
      const errors = {};
      const validator = sinon.spy();
      const uiSchema = {
        'ui:validations': [
          {
            validator,
            options: {}
          }
        ],
        'ui:errorMessages': {}
      };
      const formData = {};
      const formContext = {};

      uiSchemaValidate(errors, uiSchema, formData, formContext);

      expect(validator.calledWith(errors, formData, formData, formContext, uiSchema['ui:errorMessages'], uiSchema['ui:validations'][0].options)).to.be.true;
    });
    it('should use custom validation on fields in object', () => {
      const errors = {
        field1: {},
        field2: {}
      };
      const validator1 = sinon.spy();
      const validator2 = sinon.spy();
      const uiSchema = {
        field1: {
          'ui:validations': [
            validator1
          ]
        },
        field2: {
          'ui:validations': [
            validator2
          ]
        }
      };
      const formData = {
        field1: {},
        field2: {}
      };
      const formContext = {};

      uiSchemaValidate(errors, uiSchema, formData, formContext);

      expect(validator1.calledWith(errors.field1, formData.field1, formData, formContext)).to.be.true;
    });
    it('should use custom validation on fields in array', () => {
      const errors = {};
      const validator = sinon.spy();
      const uiSchema = {
        items: {
          field: {
            'ui:validations': [
              validator
            ]
          }
        }
      };
      const formData = [
        {
          field: {}
        }
      ];
      const formContext = {};

      uiSchemaValidate(errors, uiSchema, formData, formContext);

      expect(validator.calledWith(errors[0].field, formData[0].field, formData, formContext)).to.be.true;
    });
  });
});
