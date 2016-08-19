import { expect } from 'chai';
import schema from '../../../src/js/edu-benefits/schema/edu-benefits';
import Ajv from 'ajv';

describe('education benefits json schema', () => {
  let ajv;
  const validateSchema = (data) => {
    return ajv.validate('edu-benefits-schema', data);
  };
  const validators = {
    valid: (data) => {
      expect(validateSchema(data)).to.equal(true);
    },
    invalid: (data) => {
      expect(validateSchema(data)).to.equal(false);
      expect(ajv.errors[0].dataPath).to.contain(`.${Object.keys(data)[0]}`);
    }
  };
  const objectBuilder = (key, value) => {
    let object = {};

    key.split('.').reverse().forEach((key, i) => {
      if (i === 0) {
        object = {
          [key]: value
        };
      } else {
        object = {
          [key]: object
        };
      }
    });

    return object;
  };
  const testValidAndInvalid = (parentKey, fields) => {
    ['valid', 'invalid'].forEach((fieldType) => {
      fields[fieldType].forEach((fields) => {
        it(`should${fieldType === 'valid' ? '' : 'nt'} allow ${parentKey} with ${JSON.stringify(fields)}`, () => {
          validators[fieldType](objectBuilder(parentKey, fields));
        });
      });
    });
  };
  const validDateRange = {
    from: '2000-01-01',
    to: '2000-01-02'
  };

  before(() => {
    ajv = new Ajv();
    ajv.addSchema(schema, 'edu-benefits-schema');
  });

  context('ssn validations', () => {
    testValidAndInvalid('socialSecurityNumber', {
      valid: ['123456789'],
      invalid: ['123-45-6789', '12345678']
    });
  });

  context('name validations', () => {
    ['fullName', 'emergencyContact.fullName'].forEach((parentKey) => {
      testValidAndInvalid(parentKey, {
        valid: [{
          first: 'john',
          last: 'doe'
        }],
        invalid: [{
          first: 'john'
        }]
      });
    });
  });

  context('gender validations', () => {
    testValidAndInvalid('gender', {
      valid: ['M', 'F'],
      invalid: ['Z']
    });
  });

  context('address validations', () => {
    ['address', 'emergencyContact.address', 'schoolAddress'].forEach((parentKey) => {
      testValidAndInvalid(parentKey, {
        valid: [{
          street: '123 a rd',
          city: 'abc',
          country: 'USA'
        }],
        invalid: [{
          city: 'foo',
          country: 'USA'
        }]
      });
    });
  });

  context('phone # validations', () => {
    ['phone', 'secondaryPhone', 'emergencyContact.phone'].forEach((parentKey) => {
      testValidAndInvalid(parentKey, {
        valid: ['5555555555'],
        invalid: ['1a']
      });
    });
  });

  context('bank account validations', () => {
    testValidAndInvalid('bankAccount.accountType', {
      valid: ['checking', 'savings'],
      invalid: ['bitcoin']
    });
  });

  context('serviceAcademyGraduationYear validations', () => {
    testValidAndInvalid('serviceAcademyGraduationYear', {
      valid: [2004],
      invalid: [1899]
    });
  });

  context('dateRange validations', () => {
    testValidAndInvalid('activeDutyRepayingPeriod', {
      valid: [validDateRange],
      invalid: [
        {
          from: 'foo',
          to: 'bar'
        },
        {
          from: '2000-01-01'
        }
      ]
    });
  });

  context('date validations', () => {
    testValidAndInvalid('birthday', {
      valid: ['2000-01-02'],
      invalid: ['4/6/1998', 'Fri Aug 19 2016 15:09:46 GMT-0400 (EDT)']
    });
  });

  context('tours of duty validation', () => {
    testValidAndInvalid('toursOfDuty', {
      valid: [[{
        dateRange: validDateRange,
        serviceBranch: 'navy',
        serviceStatus: 'active',
        involuntarilyCalledToDuty: true
      }]],
      invalid: [[{
        serviceBranch: 'navy',
        serviceStatus: 'active',
        involuntarilyCalledToDuty: true
      }]],
    });
  });

  context('post high school trainings validation', () => {
    testValidAndInvalid('postHighSchoolTrainings', {
      valid: [[{
        name: 'college',
        dateRange: validDateRange,
        city: 'new york',
        state: 'NY'
      }]],
      invalid: [[{
        name: 'college'
      }]]
    });
  });
});
