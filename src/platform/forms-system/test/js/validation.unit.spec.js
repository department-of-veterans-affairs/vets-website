import { expect } from 'chai';
import moment from 'moment';
import sinon from 'sinon';

import {
  transformErrors,
  uiSchemaValidate,
  validateSSN,
  validateDate,
  validateCurrentOrPastDate,
  validateCurrentOrFutureDate,
  validateMatch,
  validateDateRange,
  validateDateRangeAllowSameMonth,
  UPLOADING_FILE,
  NOT_UPLOADED,
  MISSING_PASSWORD_ERROR,
  getFileError,
  validateFileField,
  validateBooleanGroup,
  validateMonthYear,
  validateCurrentOrPastMonthYear,
  validateAutosuggestOption,
  isValidForm,
} from '../../src/js/validation';
import { minYear, maxYear } from '../../src/js/helpers';

describe('Schemaform validations', () => {
  describe('transformErrors', () => {
    it('should transform error into message from uiSchema', () => {
      const errors = [
        {
          name: 'test',
          property: 'instance.field',
          argument: '',
          message: 'Old message',
        },
      ];
      const uiSchema = {
        field: {
          'ui:errorMessages': {
            test: 'New message',
          },
        },
      };

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].message).to.equal(
        uiSchema.field['ui:errorMessages'].test,
      );
    });
    it('should transform error message into default', () => {
      const errors = [
        {
          name: 'maxLength',
          property: 'instance.field',
          argument: 5,
          message: 'Old message',
        },
      ];
      const uiSchema = {};

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].message).to.equal(
        'This field should be less than 5 characters',
      );
    });
    it('should transform error message into email default', () => {
      const errors = [
        {
          name: 'format',
          property: 'instance.field',
          argument: 'email',
          message: 'Old message',
        },
      ];
      const uiSchema = {};

      const newErrors = transformErrors(errors, uiSchema);

      expect(newErrors[0].message).to.equal(
        'Please enter a valid email address',
      );
    });
    it('should transform required message to field level', () => {
      const errors = [
        {
          name: 'required',
          property: 'instance',
          argument: 'field',
          message: 'Old message',
        },
      ];
      const uiSchema = {};

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
        'ui:validations': [validator],
        'ui:errorMessages': {},
      };
      const formData = {};

      uiSchemaValidate(errors, uiSchema, schema, formData);

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
            options: {},
          },
        ],
        'ui:errorMessages': {},
      };
      const formData = {};

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(
        validator.calledWith(
          errors,
          formData,
          formData,
          uiSchema['ui:validations'][0].options,
        ),
      ).to.be.true;
    });
    it('should use custom validation on fields in object', () => {
      const errors = {
        field1: {},
        field2: {},
      };
      const validator1 = sinon.spy();
      const validator2 = sinon.spy();
      const schema = {
        properties: {
          field1: {},
          field2: {},
        },
      };
      const uiSchema = {
        field1: {
          'ui:validations': [validator1],
        },
        field2: {
          'ui:validations': [validator2],
        },
      };
      const formData = {
        field1: {},
        field2: {},
      };

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(
        validator1.calledWith(
          errors.field1,
          formData.field1,
          formData,
          schema.properties.field1,
          undefined,
        ),
      ).to.be.true;
    });
    it('should use custom validation on fields in array', () => {
      const errors = {};
      const validator = sinon.spy();
      const schema = {
        type: 'array',
        items: [
          {
            properties: {
              field: {},
            },
          },
        ],
      };
      const uiSchema = {
        items: {
          field: {
            'ui:validations': [validator],
          },
        },
      };
      const formData = [
        {
          field: {},
        },
      ];

      uiSchemaValidate(errors, uiSchema, schema, formData);

      expect(
        validator.calledWith(
          errors[0].field,
          formData[0].field,
          formData,
          schema.items[0].properties.field,
          undefined,
        ),
      ).to.be.true;
    });
    it('should skip validation when array is undefined', () => {
      const errors = {};
      const validator = sinon.spy();
      const schema = {
        items: {
          properties: {
            field: {},
          },
        },
      };
      const uiSchema = {
        items: {
          field: {
            'ui:validations': [validator],
          },
        },
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
    it('should set message if date is less than min year', () => {
      const errors = { addError: sinon.spy() };
      validateDate(errors, `${minYear - 1}-01-01`);
      expect(errors.addError.callCount).to.equal(1);
    });
    it('should set message if date is greater than max year', () => {
      const errors = { addError: sinon.spy() };
      validateDate(errors, `${maxYear + 1}-01-01`);
      expect(errors.addError.callCount).to.equal(1);
    });

    it('should set message if date is not valid', () => {
      const errors = { addError: sinon.spy() };
      validateDate(errors, `2023-09-31`);
      expect(errors.addError.callCount).to.equal(1);
    });
  });
  describe('validateCurrentOrPastDate', () => {
    it('should set message if invalid', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = moment()
        .add(2, 'year')
        .format('YYYY-MM-DD');
      validateCurrentOrPastDate(errors, futureDate);

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal(
        'Please provide a valid current or past date',
      );
    });
    it('should set message if invalid', () => {
      const errors = { addError: sinon.spy() };
      const pastDate = `${minYear - 1}-01-01`;
      const currentYear = new Date().getFullYear();
      validateCurrentOrPastDate(errors, pastDate);

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal(
        `Please enter a year between ${minYear} and ${currentYear}`,
      );
    });
    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      const futureDate = moment()
        .add(2, 'year')
        .format('YYYY-MM-DD');
      validateCurrentOrPastDate(errors, futureDate, null, null, {
        futureDate: 'Blah blah',
      });

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal('Blah blah');
    });
  });
  describe('validateCurrentOrFutureDate', () => {
    it('should set message if invalid', () => {
      const errors = { addError: sinon.spy() };
      const pastDate = moment()
        .add(-2, 'year')
        .format('YYYY-MM-DD');
      validateCurrentOrFutureDate(errors, pastDate);

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal(
        'Please provide a valid current or future date',
      );
    });
    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      const pastDate = moment()
        .add(-2, 'year')
        .format('YYYY-MM-DD');
      validateCurrentOrFutureDate(errors, pastDate, null, null, {
        pastDate: 'Blah blah',
      });

      expect(errors.addError.callCount).to.equal(1);
      expect(errors.addError.firstCall.args[0]).to.equal('Blah blah');
    });
  });
  describe('validateMatch', () => {
    it('should set message if emails do not match', () => {
      const errors = { confirmEmail: { addError: sinon.spy() } };
      validateMatch('email', 'confirmEmail')(errors, {
        email: 'test@test.com',
        confirmEmail: 'test3@test.com',
      });

      expect(errors.confirmEmail.addError.called).to.be.true;
    });
    it('should not set message if emails match', () => {
      const errors = { confirmEmail: { addError: sinon.spy() } };
      validateMatch('email', 'confirmEmail')(errors, {
        email: 'test@test.com',
        confirmEmail: 'test@test.com',
      });

      expect(errors.confirmEmail.addError.called).to.be.false;
    });
    it('should not set message if emails match when ignoring case', () => {
      const errors = { confirmEmail: { addError: sinon.spy() } };
      validateMatch('email', 'confirmEmail', { ignoreCase: true })(errors, {
        email: 'test@test.com',
        confirmEmail: 'TEST@TEST.COM',
      });

      expect(errors.confirmEmail.addError.called).to.be.false;
    });
  });
  describe('validateDateRange', () => {
    it('should not set message if date range is valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRange(errors, {
        from: '2014-01-04',
        to: '2015-01-04',
      });

      expect(errors.to.addError.called).to.be.false;
    });
    it('should set message if date range is not valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRange(
        errors,
        {
          from: '2014-01-04',
          to: '2012-01-04',
        },
        null,
        null,
        {},
      );

      expect(errors.to.addError.called).to.be.true;
    });
    it('should set custom message from config if date range is not valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRange(
        errors,
        {
          from: '2014-01-04',
          to: '2012-01-04',
        },
        null,
        null,
        { pattern: 'Test message' },
      );

      expect(errors.to.addError.calledWith('Test message')).to.be.true;
    });
  });
  describe('validateDateRangeAllowSameMonth', () => {
    it('should not set message if date range is valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRangeAllowSameMonth(errors, {
        // the difference from validateDateRange
        from: '2014-01-01',
        to: '2014-01-01',
      });

      expect(errors.to.addError.called).to.be.false;
    });
    it('should set message if date range is not valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRangeAllowSameMonth(
        errors,
        {
          from: '2014-01-04',
          to: '2012-01-04',
        },
        null,
        null,
        {},
      );

      expect(errors.to.addError.called).to.be.true;
    });
    it('should set custom message from config if date range is not valid', () => {
      const errors = { to: { addError: sinon.spy() } };
      validateDateRangeAllowSameMonth(
        errors,
        {
          from: '2014-01-04',
          to: '2012-01-04',
        },
        null,
        null,
        { pattern: 'Test message' },
      );

      expect(errors.to.addError.calledWith('Test message')).to.be.true;
    });
  });

  describe('getFileError', () => {
    it('should return errorMessage', () => {
      expect(getFileError({ errorMessage: 'yep' })).to.eq('yep');
      expect(
        getFileError({
          errorMessage: 'yep',
          isEncrypted: true,
          password: '123',
          confirmationCode: '1',
        }),
      ).to.eq('yep');
    });
    it('should return uploading message', () => {
      expect(
        getFileError({
          uploading: true,
          confirmationCode: '1',
          isEncrypted: true,
          password: '123',
        }),
      ).to.eq(UPLOADING_FILE);
    });
    it('should return missing password message', () => {
      expect(getFileError({ isEncrypted: true })).to.eq(MISSING_PASSWORD_ERROR);
    });
    it('should return null', () => {
      expect(getFileError({ confirmationCode: '1' })).to.be.null;
      expect(getFileError({ confirmationCode: 123 })).to.be.null;
      expect(getFileError({ confirmationCode: '1', isEncrypted: true })).to.be
        .null;
      expect(
        getFileError({
          confirmationCode: '1',
          isEncrypted: true,
          password: '123',
        }),
      ).to.be.null;
    });
  });

  describe('validateFileField', () => {
    it('should mark uploading files as invalid', () => {
      const errors = [{ addError: sinon.spy() }];
      validateFileField(errors, [
        {
          uploading: true,
          confirmationCode: '23234',
        },
      ]);

      expect(errors[0].addError.called).to.be.true;
    });
    it('should mark files with error message as invalid', () => {
      const errors = [{ addError: sinon.spy() }];
      validateFileField(errors, [
        {
          uploading: false,
          errorMessage: 'test',
        },
      ]);

      expect(errors[0].addError.calledWith('test')).to.be.true;
    });
    it('should mark files without confirmation number as invalid', () => {
      const errors = [{ addError: sinon.spy() }];
      validateFileField(errors, [
        {
          uploading: false,
        },
      ]);

      expect(errors[0].addError.calledWith(NOT_UPLOADED)).to.be.true;
    });
    it('should mark PDF file as invalid if still awaiting password entry', () => {
      const errors = [{ addError: sinon.spy() }];
      validateFileField(errors, [
        {
          isEncrypted: true,
          // password: '',
          // confirmationCode: '',
        },
      ]);

      expect(errors[0].addError.calledWith(MISSING_PASSWORD_ERROR)).to.be.true;
    });
    it('should not mark PDF file as invalid if missing password but successfully uploaded', () => {
      const errors = [{ addError: sinon.spy() }];
      validateFileField(errors, [
        {
          isEncrypted: true,
          // password: '',
          confirmationCode: '1234',
        },
      ]);

      expect(errors[0].addError.called).to.be.false;
    });
  });
  describe('validateBooleanGroup', () => {
    it('should add error if no props are true', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(errors, {
        tests: false,
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
        tests: true,
      });

      expect(errors.addError.called).to.be.false;
    });

    it('should use custom message', () => {
      const errors = { addError: sinon.spy() };
      validateBooleanGroup(
        errors,
        {
          tests: false,
        },
        null,
        null,
        { atLeastOne: 'testing' },
      );

      expect(errors.addError.firstCall.args[0]).to.equal('testing');
    });
  });
  describe('isValidForm', () => {
    it('should validate pagePerItem schema', () => {
      const form = {
        data: {
          privacyAgreementAccepted: true,
          testArray: ['test', 3],
        },
        pages: {
          testPage: {
            schema: {
              type: 'object',
              properties: {
                testArray: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
            uiSchema: {},
            showPagePerItem: true,
            arrayPath: 'testArray',
          },
        },
      };
      const pageList = [
        {
          pageKey: 'testPage',
          chapterKey: 'testChapter',
        },
      ];

      expect(isValidForm(form, pageList).isValid).to.be.false;
    });
    it('should validate only filtered items for pagePerItem schema', () => {
      const form = {
        data: {
          privacyAgreementAccepted: true,
          testArray: ['test', 3],
        },
        pages: {
          testPage: {
            schema: {
              type: 'object',
              properties: {
                testArray: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
            uiSchema: {},
            itemFilter: (item, index) => index < 1,
            showPagePerItem: true,
            arrayPath: 'testArray',
          },
        },
      };
      const pageList = [
        {
          pageKey: 'testPage',
          chapterKey: 'testChapter',
        },
      ];

      const result = isValidForm(form, pageList, true);

      expect(result.isValid).to.be.true;
      expect(result.formData.testArray).to.deep.equal(['test']);
      // schema is _not_ modified since it isn't an array
      expect(
        form.pages.testPage.schema.properties.testArray.items,
      ).to.deep.equal({ type: 'string' });
    });
    it('should not validate pages where depends is false', () => {
      const form = {
        data: {
          privacyAgreementAccepted: true,
          testArray: ['test'],
        },
        pages: {
          testPage2: {
            schema: {
              type: 'object',
              properties: {
                testArray: {
                  type: 'string',
                },
              },
            },
            uiSchema: {},
          },
          testPage: {
            schema: {
              type: 'object',
              properties: {
                testArray: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
            uiSchema: {},
          },
        },
      };
      const pageList = [
        {
          pageKey: 'testPage',
          chapterKey: 'testChapter',
        },
        {
          pageKey: 'testPage2',
          chapterKey: 'testChapter',
          depends: sinon.stub().returns(false),
        },
      ];

      expect(isValidForm(form, pageList).isValid).to.be.true;
      expect(pageList[1].depends.calledWith(form.data)).to.be.true;
    });
    it('should match array itemSchema entries with formData array items', () => {
      // The array items have different required fields, but some items are
      // filtered out for the page. This test ensures that the corresponding
      // schemas are also removed because they may be different.
      const form = {
        data: {
          privacyAgreementAccepted: true,
          newDisabilities: [
            { condition: 'PTSD' },
            { cause: 'NEW', primaryDescription: 'while in service...' },
            { cause: 'SECONDARY' },
          ],
        },
        pages: {
          newDisabilityFollowUp: {
            uiSchema: {},
            schema: {
              type: 'object',
              properties: {
                newDisabilities: {
                  type: 'array',
                  items: [
                    { type: 'object', required: ['condition'] },
                    {
                      type: 'object',
                      required: ['cause', 'primaryDescription'],
                    },
                    { type: 'object', required: ['cause'] },
                  ],
                  additionalItems: {
                    type: 'object',
                    required: ['cause'],
                    properties: {
                      cause: { type: 'string' },
                      primaryDescription: { type: 'string' },
                    },
                  },
                },
              },
            },
            editMode: [false, false, false],
            showPagePerItem: true,
            arrayPath: 'newDisabilities',
            itemFilter: item => item.condition !== 'PTSD',
          },
        },
      };
      const pageList = [
        {
          path: '/new-disabilities/follow-up/:index',
          showPagePerItem: true,
          arrayPath: 'newDisabilities',
          uiSchema: {},
          schema: {
            type: 'object',
            properties: {
              newDisabilities: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['cause'],
                  properties: {
                    cause: {
                      type: 'string',
                      enum: ['NEW', 'SECONDARY', 'WORSENED', 'VA'],
                    },
                    primaryDescription: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          chapterTitle: 'Disabilities',
          chapterKey: 'disabilities',
          pageKey: 'newDisabilityFollowUp',
        },
      ];

      const result = isValidForm(form, pageList, true);

      expect(result.isValid).to.be.true;
      expect(result.formData.newDisabilities).to.deep.equal([
        { cause: 'NEW', primaryDescription: 'while in service...' },
        { cause: 'SECONDARY' },
      ]);
      // schema _is_ modified, PTSD schema entry has been removed
      expect(
        form.pages.newDisabilityFollowUp.schema.properties.newDisabilities
          .items,
      ).to.deep.equal([
        {
          type: 'object',
          required: ['cause', 'primaryDescription'],
        },
        { type: 'object', required: ['cause'] },
      ]);
    });
  });
  describe('validateMonthYear', () => {
    it('should validate month and year', () => {
      const errors = { addError: sinon.spy() };
      validateMonthYear(errors, '20123-43-XX', null, null, {
        atLeastOne: 'testing',
      });

      expect(errors.addError.firstCall.args[0]).to.equal(
        'Please provide a valid date',
      );
    });
    it('should pass with valid month and year', () => {
      const errors = { addError: sinon.spy() };
      validateMonthYear(errors, '2012-03-XX', null, null, {
        atLeastOne: 'testing',
      });

      expect(errors.addError.called).to.be.false;
    });
  });
  describe('validateCurrentOrPastMonthYear', () => {
    it('should validate month and year', () => {
      const errors = { addError: sinon.spy() };
      validateCurrentOrPastMonthYear(errors, '20123-43-XX');

      expect(errors.addError.firstCall.args[0]).to.equal(
        'Please provide a valid date',
      );
    });
    it('should pass with valid month and year', () => {
      const errors = { addError: sinon.spy() };
      validateCurrentOrPastMonthYear(errors, '2012-03-XX');

      expect(errors.addError.called).to.be.false;
    });
    it('should fail with date in future', () => {
      const errors = { addError: sinon.spy() };
      validateCurrentOrPastMonthYear(
        errors,
        moment()
          .add(1, 'year')
          .format('YYYY-MM-[XX]'),
      );

      expect(errors.addError.firstCall.args[0]).to.equal(
        'Please provide a valid current or past date',
      );
    });
  });
  describe('validateAutosuggestOption', () => {
    it('should validate that id is required with label', () => {
      const errors = { addError: sinon.spy() };
      validateAutosuggestOption(errors, {
        widget: 'autosuggest',
        label: 'blah',
      });

      expect(errors.addError.firstCall.args[0]).to.equal(
        'Please select an option from the suggestions',
      );
    });
    it('should pass if id is included', () => {
      const errors = { addError: sinon.spy() };
      validateAutosuggestOption(errors, {
        widget: 'autosuggest',
        id: '1',
        label: 'blah',
      });

      expect(errors.addError.called).to.be.false;
    });
  });
});
