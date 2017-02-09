import { expect } from 'chai';
import sinon from 'sinon';

import {
  transformErrors,
  uiSchemaValidate,
  validateSSN,
  validateDate,
  validateMatch,
  validateDateRange
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
    it('should transform error message into email default', () => {
      const errors = [
        {
          name: 'format',
          property: 'instance.field',
          argument: 'email',
          message: 'Old message'
        }
      ];
      const uiSchema = {
      };

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].message).to.equal('Please enter a valid email address');
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
      const schema = {
        properties: {
          field1: {

          },
          field2: {

          }
        }
      };
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

      uiSchemaValidate(errors, uiSchema, schema, formData, formContext);

      expect(validator1.calledWith(errors.field1, formData.field1, formData, schema.properties.field1, undefined)).to.be.true;
    });
    it('should use custom validation on fields in array', () => {
      const errors = {};
      const validator = sinon.spy();
      const schema = {
        items: {
          properties: {
            field: {

            }
          }
        }
      };
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

      uiSchemaValidate(errors, uiSchema, schema, formData, formContext);

      expect(validator.calledWith(errors[0].field, formData[0].field, formData, schema.items.properties.field, undefined)).to.be.true;
    });
  });
  describe('validateSSN', () => {
    it('should set message if invalid', () => {
      const errors = { addError: sinon.spy() };
      validateSSN(errors, 'asfd');
      validateSSN(errors, '123334455');

      expect(errors.addError.callCount).to.equal(1);
    });
  });
  describe('validateDate', () => {
    it('should set message if invalid', () => {
      const errors = { addError: sinon.spy() };
      validateDate(errors, '2010-01-03');
      validateDate(errors, 'asdf-01-03');

      expect(errors.addError.callCount).to.equal(1);
    });
  });
  describe('validateMatch', () => {
    it('should set message if emails do not match', () => {
      const errors = { confirmEmail: { addError: sinon.spy() } };
      validateMatch('email', 'confirmEmail')(errors, {
        email: 'test@test.com',
        confirmEmail: 'test3@test.com'
      });

      expect(errors.confirmEmail.addError.called).to.be.true;
    });
    it('should not set message if emails match', () => {
      const errors = { confirmEmail: { addError: sinon.spy() } };
      validateMatch('email', 'confirmEmail')(errors, {
        email: 'test@test.com',
        confirmEmail: 'test@test.com'
      });

      expect(errors.confirmEmail.addError.called).to.be.false;
    });
  });
  describe('validateDateRange', () => {
    it('should not set message if date range is valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRange(errors, {
        from: '2014-01-04',
        to: '2015-01-04'
      });

      expect(errors.to.addError.called).to.be.false;
    });
    it('should set message if date range is not valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRange(errors, {
        from: '2014-01-04',
        to: '2012-01-04'
      }, null, null, {});

      expect(errors.to.addError.called).to.be.true;
    });
    it('should set custom message from config if date range is not valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRange(errors, {
        from: '2014-01-04',
        to: '2012-01-04'
      }, null, null, { dateRange: 'Test message' });

      expect(errors.to.addError.calledWith('Test message')).to.be.true;
    });
  });
});
