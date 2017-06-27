import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';

import {
  transformErrors,
  uiSchemaValidate,
  validateSSN,
  validateDate,
  validateCurrentOrPastDate,
  validateMatch,
  validateDateRange,
  validateFileField,
  validateBooleanGroup
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
      const schema = {};
      const uiSchema = {
        'ui:validations': [
          validator
        ],
        'ui:errorMessages': {}
      };
      const formData = {};

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(errors.__errors).to.be.defined;
      expect(errors.addError).to.be.function;
      expect(validator.calledWith(errors, formData, formData)).to.be.true;
    });
    it('should use custom validation with object validator', () => {
      const errors = {};
      const validator = sinon.spy();
      const schema = {};
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

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(validator.calledWith(errors, formData, formData, uiSchema['ui:validations'][0].options)).to.be.true;
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

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(validator1.calledWith(errors.field1, formData.field1, formData, schema.properties.field1, undefined)).to.be.true;
    });
    it('should use custom validation on fields in array', () => {
      const errors = {};
      const validator = sinon.spy();
      const schema = {
        type: 'array',
        items: [{
          properties: {
            field: {

            }
          }
        }]
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

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(validator.calledWith(errors[0].field,
        formData[0].field,
        formData,
        schema.items[0].properties.field,
        undefined)).to.be.true;
    });
    it('should skip validation when array is undefined', () => {
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

      uiSchemaValidate(errors, uiSchema, schema, undefined);

      expect(validator.called).to.be.false;
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
  describe('validateCurrentOrPastDate', () => {
    it('should set message if invalid', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = moment().add(2, 'year').format('YYYY-MM-DD');
      validateCurrentOrPastDate(errors, futureDate);

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal('Please provide a valid current or past date');
    });
    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = moment().add(2, 'year').format('YYYY-MM-DD');
      validateCurrentOrPastDate(errors, futureDate, null, null, { futureDate: 'Blah blah' });

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal('Blah blah');
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
      }, null, null, { pattern: 'Test message' });

      expect(errors.to.addError.calledWith('Test message')).to.be.true;
    });
  });
  describe('validateFileField', () => {
    it('should mark uploading files as invalid', () => {
      const errors = {};
      validateFileField(errors, [{
        uploading: true,
        confirmationCode: '23234'
      }]);

      expect(errors[0].__errors).not.to.be.empty;
    });
    it('should mark files with error message as invalid', () => {
      const errors = { __errors: [], addError: function addError(error) { this.__errors.push(error); } };
      validateFileField(errors, [{
        uploading: false,
        errorMessage: 'test'
      }]);

      expect(errors[0].__errors[0]).to.equal('Error: test');
      expect(errors.__errors).not.to.be.empty;
    });
    it('should mark files without confirmation number as invalid', () => {
      const errors = {};
      validateFileField(errors, [{
        uploading: false
      }]);

      expect(errors[0].__errors).not.to.be.empty;
    });
  });
  describe('validateBooleanGroup', () => {
    it('should add error if no props are true', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, {
        tests: false
      });

      expect(errors.addError.called).to.be.true;
    });

    it('should add error if empty object', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, {});

      expect(errors.addError.called).to.be.true;
    });

    it('should not add error if at least one prop is true', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, {
        tests: true
      });

      expect(errors.addError.called).to.be.false;
    });

    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, {
        tests: false
      }, null, null, { atLeastOne: 'testing' });

      expect(errors.addError.firstCall.args[0]).to.equal('testing');
    });
  });
});
