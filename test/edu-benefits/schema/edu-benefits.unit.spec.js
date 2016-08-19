import { expect } from 'chai';
import schema from '../../../src/js/edu-benefits/schema/edu-benefits';
import Ajv from 'ajv';

describe('education benefits json schema', () => {
  let ajv;
  let validateSchema = (data) => {
    return ajv.validate('edu-benefits-schema', data);
  };
  let expectValidData = (data) => {
    expect(validateSchema(data)).to.equal(true);
  };
  let expectInvalidData = (data, key) => {
    expect(validateSchema(data)).to.equal(false);
    expect(ajv.errors[0].dataPath).to.equal(`.${key}`);
  };

  before(() => {
    ajv = new Ajv();
    ajv.addSchema(schema, 'edu-benefits-schema');
  });

  context('ssn validations', () => {
    it('should allow an ssn with no dashes', () => {
      expectValidData({ socialSecurityNumber: '123456789' });
    });

    it('should not allow ssn with dashes', () => {
      expectInvalidData({ socialSecurityNumber: '123-45-6789' }, 'socialSecurityNumber');
    });

    it('should not allow bad ssn', () => {
      expectInvalidData({ socialSecurityNumber: '12345678' }, 'socialSecurityNumber');
    });
  });

  context('name validations', () => {
    it('should allow a valid name', () => {
      expectValidData({
        fullName: {
          first: 'john',
          last: 'doe'
        }
      });
    });

    it('shouldnt allow an invalid name', () => {
      expectInvalidData({
        fullName: {
          first: 'john'
        }
      }, 'fullName');
    })
  });

  context('gender validations', () => {
    it('should allow a valid gender', () => {
      ['M', 'F'].forEach((gender) => {
        expectValidData({ gender: gender });
      });
    });

    it('shouldnt allow invalid gender', () => {
      expectInvalidData({ gender: 'Z' }, 'gender');
    })
  });

  context('address validations', () => {
    it('should allow a valid address', () => {
      expectValidData({
        address: {
          street: '123 a rd',
          city: 'abc',
          country: 'USA'
        }
      });
    });

    it('shouldnt allow an invalid address', () => {
      expectInvalidData({
        address: {
          city: 'foo',
          country: 'USA'
        }
      }, 'address');
    });
  });

  context('phone # validations', () => {
    ['phone', 'secondaryPhone'].forEach((field) => {
      context(`phone number in ${field} field`, () => {
        it('should allow valid phone #', () => {
          expectValidData({
            [field]: '5555555555'
          });
        });

        it('shouldnt allow invalid phone #', () => {
          expectInvalidData({
            [field]: '1a'
          }, field);
        });
      });
    });
  });
});
