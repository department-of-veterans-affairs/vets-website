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
});
